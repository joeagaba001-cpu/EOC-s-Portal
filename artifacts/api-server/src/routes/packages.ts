import { Router } from "express";
import { db, packagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res): Promise<void> => {
  try {
    const packages = await db.select().from(packagesTable).orderBy(packagesTable.price);
    res.json(packages.map(formatPackage));
  } catch (err) {
    logger.error({ err }, "Error listing packages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req, res): Promise<void> => {
  try {
    const { name, description, price, duration } = req.body;
    if (!name || !price || !duration) { res.status(400).json({ error: "name, price, and duration are required" }); return; }
    const [pkg] = await db.insert(packagesTable).values({ name, description, price, duration }).returning();
    res.status(201).json(formatPackage(pkg));
  } catch (err) {
    logger.error({ err }, "Error creating package");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAuth, async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const { name, description, price, duration } = req.body;
    const [updated] = await db.update(packagesTable)
      .set({ name, description, price, duration })
      .where(eq(packagesTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Package not found" }); return; }
    res.json(formatPackage(updated));
  } catch (err) {
    logger.error({ err }, "Error updating package");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    await db.delete(packagesTable).where(eq(packagesTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Error deleting package");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatPackage(pkg: any) {
  return { id: pkg.id, name: pkg.name, description: pkg.description, price: pkg.price, duration: pkg.duration, createdAt: pkg.createdAt };
}

export default router;
