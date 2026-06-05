import { Router } from "express";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const notifications = await db.select().from(notificationsTable)
      .where(eq(notificationsTable.userId, user.id))
      .orderBy(notificationsTable.createdAt);

    res.json(notifications.map(formatNotification));
  } catch (err) {
    logger.error({ err }, "Error listing notifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const { targetUserId, title, message, type } = req.body;
    if (!title || !message) { res.status(400).json({ error: "title and message are required" }); return; }

    if (targetUserId) {
      const [n] = await db.insert(notificationsTable).values({
        userId: targetUserId, title, message, type: type || "info", isRead: false,
      }).returning();
      res.status(201).json(formatNotification(n));
      return;
    }

    const users = await db.select().from(usersTable);
    const inserted = await db.insert(notificationsTable).values(
      users.map(u => ({ userId: u.id, title, message, type: type || "info", isRead: false }))
    ).returning();

    res.status(201).json(formatNotification(inserted[0]));
  } catch (err) {
    logger.error({ err }, "Error sending notification");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/read", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const [updated] = await db.update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Notification not found" }); return; }
    res.json(formatNotification(updated));
  } catch (err) {
    logger.error({ err }, "Error marking notification read");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatNotification(n: any) {
  return { id: n.id, userId: n.userId, title: n.title, message: n.message, type: n.type, isRead: n.isRead, createdAt: n.createdAt };
}

export default router;
