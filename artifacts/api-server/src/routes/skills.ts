import { Router } from "express";
import { db, skillsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res): Promise<void> => {
  try {
    const skills = await db.select().from(skillsTable).orderBy(skillsTable.category, skillsTable.name);
    res.json(skills.map(formatSkill));
  } catch (err) {
    logger.error({ err }, "Error listing skills");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req, res): Promise<void> => {
  try {
    const { name, category, description } = req.body;
    if (!name || !category) { res.status(400).json({ error: "name and category are required" }); return; }
    const [skill] = await db.insert(skillsTable).values({ name, category, description }).returning();
    res.status(201).json(formatSkill(skill));
  } catch (err) {
    logger.error({ err }, "Error creating skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAuth, async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const { name, category, description } = req.body;
    const [updated] = await db.update(skillsTable)
      .set({ name, category, description })
      .where(eq(skillsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Skill not found" }); return; }
    res.json(formatSkill(updated));
  } catch (err) {
    logger.error({ err }, "Error updating skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    await db.delete(skillsTable).where(eq(skillsTable.id, id));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Error deleting skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatSkill(skill: any) {
  return { id: skill.id, name: skill.name, category: skill.category, description: skill.description, createdAt: skill.createdAt };
}

export default router;
