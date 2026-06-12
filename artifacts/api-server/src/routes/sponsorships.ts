import { Router } from "express";
import { db, sponsorshipsTable, usersTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (_req, res): Promise<void> => {
  try {
    const all = await db.select().from(sponsorshipsTable).orderBy(sponsorshipsTable.createdAt);
    res.json(all);
  } catch (err) {
    logger.error({ err }, "Error listing sponsorships");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const { fullName, organization, email, phone, sponsorshipType, donationAmount, message } = req.body;
    if (!fullName || !phone || !sponsorshipType) {
      res.status(400).json({ error: "fullName, phone, and sponsorshipType are required" });
      return;
    }

    const [entry] = await db.insert(sponsorshipsTable).values({
      fullName, organization, email, phone, sponsorshipType,
      donationAmount: donationAmount ? parseInt(donationAmount) : null,
      message,
    }).returning();

    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    if (officers.length > 0) {
      await db.insert(notificationsTable).values(
        officers.map(o => ({
          userId: o.id,
          title: "New Sponsorship Application",
          message: `${fullName}${organization ? ` (${organization})` : ""} has submitted a sponsorship application.`,
          type: "info",
          isRead: false,
        }))
      );
    }

    res.status(201).json(entry);
  } catch (err) {
    logger.error({ err }, "Error submitting sponsorship");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/status", requireAuth, async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const { status } = req.body;
    const [updated] = await db.update(sponsorshipsTable)
      .set({ status })
      .where(eq(sponsorshipsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Sponsorship not found" }); return; }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Error updating sponsorship status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
