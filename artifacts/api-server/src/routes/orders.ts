import { Router } from "express";
import { db, cateringOrdersTable, usersTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", requireAuth, async (_req, res): Promise<void> => {
  try {
    const all = await db.select().from(cateringOrdersTable).orderBy(cateringOrdersTable.createdAt);
    res.json(all);
  } catch (err) {
    logger.error({ err }, "Error listing catering orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const {
      customerName, phone, email, eventType, eventDate,
      guestCount, eventAddress, menuItems, specialRequests,
    } = req.body;

    if (!customerName || !phone || !eventType || !eventAddress) {
      res.status(400).json({ error: "customerName, phone, eventType, and eventAddress are required" });
      return;
    }

    const [order] = await db.insert(cateringOrdersTable).values({
      customerName,
      phone,
      email: email || null,
      eventType,
      eventDate: eventDate || null,
      guestCount: guestCount ? parseInt(guestCount) : null,
      eventAddress,
      menuItems: Array.isArray(menuItems) ? JSON.stringify(menuItems) : menuItems || null,
      specialRequests: specialRequests || null,
    }).returning();

    const officers = await db.select().from(usersTable).where(eq(usersTable.role, "officer"));
    if (officers.length > 0) {
      await db.insert(notificationsTable).values(
        officers.map(o => ({
          userId: o.id,
          title: "New Catering Order",
          message: `${customerName} has placed a catering order for ${eventType} on ${eventDate ?? "unspecified date"}.`,
          type: "info" as const,
          isRead: false,
        }))
      );
    }

    res.status(201).json(order);
  } catch (err) {
    logger.error({ err }, "Error creating catering order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/status", requireAuth, async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params["id"]));
    const { status, officerNotes } = req.body;

    const [updated] = await db.update(cateringOrdersTable)
      .set({ status, ...(officerNotes !== undefined ? { officerNotes } : {}) })
      .where(eq(cateringOrdersTable.id, id))
      .returning();

    if (!updated) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Error updating catering order status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
