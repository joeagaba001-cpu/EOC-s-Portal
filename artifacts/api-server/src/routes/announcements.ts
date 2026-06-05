import { Router } from "express";
import { db, announcementsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res): Promise<void> => {
  try {
    const announcements = await db.select().from(announcementsTable).orderBy(announcementsTable.createdAt);
    res.json(announcements.map(formatAnnouncement));
  } catch (err) {
    logger.error({ err }, "Error listing announcements");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const { title, content } = req.body;
    if (!title || !content) { res.status(400).json({ error: "title and content are required" }); return; }

    const [announcement] = await db.insert(announcementsTable).values({
      title, content, createdBy: user.id,
    }).returning();

    res.status(201).json(formatAnnouncement(announcement));
  } catch (err) {
    logger.error({ err }, "Error creating announcement");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatAnnouncement(a: any) {
  return { id: a.id, title: a.title, content: a.content, createdAt: a.createdAt, createdBy: a.createdBy };
}

export default router;
