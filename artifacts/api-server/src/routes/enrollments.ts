import { Router } from "express";
import { db, enrollmentsTable, enrollmentSkillsTable, usersTable, packagesTable, skillsTable, notificationsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const { status } = req.query as { status?: string };

    let enrollments;
    if (user.role === "officer") {
      enrollments = await db.select().from(enrollmentsTable).orderBy(enrollmentsTable.createdAt);
    } else {
      enrollments = await db.select().from(enrollmentsTable)
        .where(eq(enrollmentsTable.userId, user.id))
        .orderBy(enrollmentsTable.createdAt);
    }

    if (status) {
      enrollments = enrollments.filter(e => e.status === status);
    }

    const enriched = await Promise.all(enrollments.map(e => enrichEnrollment(e)));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Error listing enrollments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const { packageId, skillIds } = req.body;
    if (!packageId || !skillIds?.length) {
      res.status(400).json({ error: "packageId and skillIds are required" });
      return;
    }

    const [enrollment] = await db.insert(enrollmentsTable).values({
      userId: user.id, packageId, status: "pending",
    }).returning();

    await db.insert(enrollmentSkillsTable).values(
      skillIds.map((sid: number) => ({ enrollmentId: enrollment.id, skillId: sid }))
    );

    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    if (officers.length > 0) {
      await db.insert(notificationsTable).values(
        officers.map(o => ({
          userId: o.id, title: "New Skills Selection",
          message: `${user.fullName} has selected catering skills and chosen a package.`,
          type: "skills", isRead: false,
        }))
      );
    }

    await db.insert(notificationsTable).values({
      userId: user.id, title: "Skills Selected Successfully",
      message: "Your catering skills have been saved. Please proceed with payment via WhatsApp.",
      type: "skills", isRead: false,
    });

    const enriched = await enrichEnrollment(enrollment);
    res.status(201).json(enriched);
  } catch (err) {
    logger.error({ err }, "Error creating enrollment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const [enrollment] = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.id, id)).limit(1);
    if (!enrollment) { res.status(404).json({ error: "Enrollment not found" }); return; }
    const enriched = await enrichEnrollment(enrollment);
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Error getting enrollment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/abort", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const id = parseInt(String(req.params.id));
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const [updated] = await db.update(enrollmentsTable)
      .set({ status: "aborted" })
      .where(eq(enrollmentsTable.id, id))
      .returning();

    if (!updated) { res.status(404).json({ error: "Enrollment not found" }); return; }

    await db.insert(notificationsTable).values({
      userId: user.id, title: "Enrollment Cancelled",
      message: "Your enrollment process has been cancelled.",
      type: "info", isRead: false,
    });

    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    if (officers.length > 0) {
      await db.insert(notificationsTable).values(
        officers.map(o => ({
          userId: o.id, title: "Enrollment Aborted",
          message: `${user.fullName} has aborted the enrollment process.`,
          type: "warning", isRead: false,
        }))
      );
    }

    const enriched = await enrichEnrollment(updated);
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Error aborting enrollment");
    res.status(500).json({ error: "Internal server error" });
  }
});

async function enrichEnrollment(enrollment: any) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, enrollment.userId)).limit(1);
  const [pkg] = await db.select().from(packagesTable).where(eq(packagesTable.id, enrollment.packageId)).limit(1);
  const skillLinks = await db.select().from(enrollmentSkillsTable).where(eq(enrollmentSkillsTable.enrollmentId, enrollment.id));
  const skillIds = skillLinks.map(s => s.skillId);
  const skills = skillIds.length > 0
    ? await db.select().from(skillsTable).where(inArray(skillsTable.id, skillIds))
    : [];

  return {
    id: enrollment.id, userId: enrollment.userId, packageId: enrollment.packageId,
    status: enrollment.status, skillIds, whatsappNumber: enrollment.whatsappNumber,
    createdAt: enrollment.createdAt,
    user: user ? { id: user.id, clerkId: user.clerkId, fullName: user.fullName, email: user.email, phone: user.phone, sex: user.sex, role: user.role, profilePhotoUrl: user.profilePhotoUrl, createdAt: user.createdAt } : null,
    package: pkg ? { id: pkg.id, name: pkg.name, description: pkg.description, price: pkg.price, duration: pkg.duration, createdAt: pkg.createdAt } : null,
    skills: skills.map(s => ({ id: s.id, name: s.name, category: s.category, description: s.description, createdAt: s.createdAt })),
  };
}

export default router;
