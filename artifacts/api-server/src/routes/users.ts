import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable, notificationsTable } from "@workspace/db";
import { eq, or, ilike } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

const OFFICER_CODE = "EOC135";

router.get("/me", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const auth = getAuth(req);
    const clerkId = auth?.userId;
    if (!clerkId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);

    if (!user) {
      const clerkUser = (auth as any).sessionClaims;
      const email = (clerkUser?.email as string) || "";
      const fullName = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "User";

      const [newUser] = await db.insert(usersTable).values({ clerkId, fullName, email }).returning();
      res.json(formatUser(newUser));
      return;
    }

    res.json(formatUser(user));
  } catch (err) {
    logger.error({ err }, "Error getting profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/me", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const clerkId = req.clerkUserId;
    const { fullName, phone, sex, profilePhotoUrl } = req.body;

    const [updated] = await db.update(usersTable)
      .set({ fullName, phone, sex, profilePhotoUrl })
      .where(eq(usersTable.clerkId, clerkId))
      .returning();

    if (!updated) { res.status(404).json({ error: "User not found" }); return; }
    res.json(formatUser(updated));
  } catch (err) {
    logger.error({ err }, "Error updating profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/complete-registration", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const auth = getAuth(req);
    const clerkId = auth?.userId;
    if (!clerkId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const { role, phone, sex, officerCode } = req.body;

    if (!role || !phone || !sex) {
      res.status(400).json({ error: "role, phone, and sex are required" });
      return;
    }

    if (role === "officer") {
      if (officerCode !== OFFICER_CODE) {
        res.status(400).json({ error: "Invalid NGO Officer Code. Registration terminated." });
        return;
      }
    } else if (role !== "participant") {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);

    if (!user) {
      const clerkUser = (auth as any).sessionClaims;
      const email = (clerkUser?.email as string) || "";
      const fullName = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "User";

      [user] = await db.insert(usersTable).values({ clerkId, fullName, email, phone, sex, role }).returning();
    } else {
      [user] = await db.update(usersTable)
        .set({ phone, sex, role })
        .where(eq(usersTable.clerkId, clerkId))
        .returning();
    }

    await db.insert(notificationsTable).values({
      userId: user.id,
      title: "Welcome to Elizabeth Okwori's Confectionery",
      message: "Your account has been successfully created. You may now login and enroll in your preferred catering skills.",
      type: "info",
      isRead: false,
    });

    res.json(formatUser(user));
  } catch (err) {
    logger.error({ err }, "Error completing registration");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const { search, role } = req.query as { search?: string; role?: string };

    let query = db.select().from(usersTable);

    if (role && search) {
      const users = await db.select().from(usersTable).where(
        eq(usersTable.role, role)
      );
      const filtered = users.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
      res.json(filtered.map(formatUser));
      return;
    }

    if (role) {
      const users = await db.select().from(usersTable).where(eq(usersTable.role, role));
      res.json(users.map(formatUser));
      return;
    }

    if (search) {
      const users = await db.select().from(usersTable).where(
        or(ilike(usersTable.fullName, `%${search}%`), ilike(usersTable.email, `%${search}%`))
      );
      res.json((users ?? []).map(formatUser));
      return;
    }

    const users = await query;
    res.json(users.map(formatUser));
  } catch (err) {
    logger.error({ err }, "Error listing users");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatUser(user: any) {
  return {
    id: user.id, clerkId: user.clerkId, fullName: user.fullName,
    email: user.email, phone: user.phone, sex: user.sex, role: user.role,
    profilePhotoUrl: user.profilePhotoUrl, createdAt: user.createdAt,
  };
}

export default router;
