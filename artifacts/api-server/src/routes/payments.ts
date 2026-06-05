import { Router } from "express";
import { db, paymentsTable, enrollmentsTable, usersTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    let payments;
    if (user.role === "officer") {
      payments = await db.select().from(paymentsTable).orderBy(paymentsTable.uploadedAt);
    } else {
      payments = await db.select().from(paymentsTable)
        .where(eq(paymentsTable.userId, user.id))
        .orderBy(paymentsTable.uploadedAt);
    }

    const enriched = await Promise.all(payments.map(p => enrichPayment(p)));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Error listing payments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const { enrollmentId, proofUrl, fileName } = req.body;
    if (!enrollmentId || !proofUrl || !fileName) {
      res.status(400).json({ error: "enrollmentId, proofUrl, and fileName are required" });
      return;
    }

    const [payment] = await db.insert(paymentsTable).values({
      enrollmentId, userId: user.id, proofUrl, fileName, status: "pending",
    }).returning();

    await db.update(enrollmentsTable).set({ status: "payment_uploaded" }).where(eq(enrollmentsTable.id, enrollmentId));

    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    if (officers.length > 0) {
      await db.insert(notificationsTable).values(
        officers.map(o => ({
          userId: o.id, title: "New Payment Proof",
          message: `${user.fullName} has submitted payment proof for verification.`,
          type: "payment", isRead: false,
        }))
      );
    }

    await db.insert(notificationsTable).values({
      userId: user.id, title: "Payment Proof Uploaded",
      message: "Your payment proof has been submitted and is awaiting verification.",
      type: "payment", isRead: false,
    });

    const enriched = await enrichPayment(payment);
    res.status(201).json(enriched);
  } catch (err) {
    logger.error({ err }, "Error submitting payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/confirm", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const [payment] = await db.update(paymentsTable)
      .set({ status: "confirmed", reviewedAt: new Date() })
      .where(eq(paymentsTable.id, id))
      .returning();
    if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }

    await db.update(enrollmentsTable).set({ status: "confirmed" }).where(eq(enrollmentsTable.id, payment.enrollmentId));

    await db.insert(notificationsTable).values({
      userId: payment.userId, title: "Payment Confirmed - Registration Successful!",
      message: "Congratulations! Your payment has been verified and your enrollment has been approved.",
      type: "success", isRead: false,
    });

    const enriched = await enrichPayment(payment);
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Error confirming payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/reject", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const [payment] = await db.update(paymentsTable)
      .set({ status: "rejected", reviewedAt: new Date() })
      .where(eq(paymentsTable.id, id))
      .returning();
    if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }

    await db.update(enrollmentsTable).set({ status: "rejected" }).where(eq(enrollmentsTable.id, payment.enrollmentId));

    await db.insert(notificationsTable).values({
      userId: payment.userId, title: "Payment Proof Not Verified",
      message: "Your payment proof could not be verified. Please upload a valid proof of payment.",
      type: "warning", isRead: false,
    });

    const enriched = await enrichPayment(payment);
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Error rejecting payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

async function enrichPayment(payment: any) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payment.userId)).limit(1);
  const [enrollment] = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.id, payment.enrollmentId)).limit(1);
  return {
    id: payment.id, enrollmentId: payment.enrollmentId, userId: payment.userId,
    proofUrl: payment.proofUrl, fileName: payment.fileName, status: payment.status,
    uploadedAt: payment.uploadedAt, reviewedAt: payment.reviewedAt,
    user: user ? { id: user.id, clerkId: user.clerkId, fullName: user.fullName, email: user.email, phone: user.phone, sex: user.sex, role: user.role, profilePhotoUrl: user.profilePhotoUrl, createdAt: user.createdAt } : null,
    enrollment: enrollment ? { id: enrollment.id, userId: enrollment.userId, packageId: enrollment.packageId, status: enrollment.status, skillIds: [], createdAt: enrollment.createdAt } : null,
  };
}

export default router;
