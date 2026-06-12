import { Router } from "express";
import { db, beneficiaryRequestsTable, usersTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const requests = user.role === "officer"
      ? await db.select().from(beneficiaryRequestsTable).orderBy(beneficiaryRequestsTable.createdAt)
      : await db.select().from(beneficiaryRequestsTable).where(eq(beneficiaryRequestsTable.userId, user.id));

    res.json(requests);
  } catch (err) {
    logger.error({ err }, "Error listing beneficiary requests");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const { fullName, participantId, reason, amountRequested, bankName, accountNumber, accountName, supportingDocs } = req.body;
    if (!fullName || !reason || !amountRequested) {
      res.status(400).json({ error: "fullName, reason, and amountRequested are required" });
      return;
    }

    const [entry] = await db.insert(beneficiaryRequestsTable).values({
      fullName, participantId, reason,
      amountRequested: parseInt(amountRequested),
      bankName, accountNumber, accountName, supportingDocs,
    }).returning();

    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    if (officers.length > 0) {
      await db.insert(notificationsTable).values(
        officers.map(o => ({
          userId: o.id,
          title: "New Fund Disbursement Request",
          message: `${fullName} has submitted a fund disbursement request for ₦${parseInt(amountRequested).toLocaleString()}.`,
          type: "info",
          isRead: false,
        }))
      );
    }

    res.status(201).json(entry);
  } catch (err) {
    logger.error({ err }, "Error submitting beneficiary request");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/review", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const { status, officerNotes } = req.body;
    const [updated] = await db.update(beneficiaryRequestsTable)
      .set({ status, officerNotes })
      .where(eq(beneficiaryRequestsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Request not found" }); return; }

    if (updated.userId) {
      const statusMessages: Record<string, string> = {
        approved: "Your fund disbursement request has been approved. Funds will be disbursed shortly.",
        rejected: "Your fund disbursement request has been reviewed and could not be approved at this time.",
        disbursed: "Your requested funds have been disbursed to your bank account.",
      };
      const msg = statusMessages[status];
      if (msg) {
        await db.insert(notificationsTable).values({
          userId: updated.userId, title: "Fund Request Update", message: msg, type: "info", isRead: false,
        });
      }
    }

    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Error reviewing beneficiary request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
