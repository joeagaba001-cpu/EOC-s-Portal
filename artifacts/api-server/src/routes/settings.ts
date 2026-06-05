import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

async function getSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
  return row?.value ?? null;
}

async function upsertSetting(key: string, value: string) {
  const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
  if (existing.length > 0) {
    await db.update(settingsTable).set({ value }).where(eq(settingsTable.key, key));
  } else {
    await db.insert(settingsTable).values({ key, value });
  }
}

// GET /api/settings
router.get("/", async (_req, res) => {
  try {
    const whatsappNumber = await getSetting("whatsapp_number");
    const contactEmail = await getSetting("contact_email");
    const address = await getSetting("address");

    res.json({ whatsappNumber, contactEmail, address });
  } catch (err) {
    logger.error({ err }, "Error getting settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/settings
router.put("/", requireAuth, async (req, res) => {
  try {
    const { whatsappNumber, contactEmail, address } = req.body;

    if (whatsappNumber !== undefined) await upsertSetting("whatsapp_number", whatsappNumber);
    if (contactEmail !== undefined) await upsertSetting("contact_email", contactEmail);
    if (address !== undefined) await upsertSetting("address", address);

    const updated = {
      whatsappNumber: await getSetting("whatsapp_number"),
      contactEmail: await getSetting("contact_email"),
      address: await getSetting("address"),
    };

    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Error updating settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
