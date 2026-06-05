import { Router } from "express";
import { db, usersTable, paymentsTable, enrollmentsTable, skillsTable, notificationsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { logger } from "../lib/logger";

const router = Router();

// GET /api/dashboard/stats
router.get("/stats", requireAuth, async (req: any, res) => {
  try {
    const allUsers = await db.select().from(usersTable);
    const totalParticipants = allUsers.filter(u => u.role === "participant").length;
    const totalOfficers = allUsers.filter(u => u.role === "officer").length;

    const allPayments = await db.select().from(paymentsTable);
    const pendingPayments = allPayments.filter(p => p.status === "pending").length;

    const allEnrollments = await db.select().from(enrollmentsTable);
    const approvedEnrollments = allEnrollments.filter(e => e.status === "confirmed").length;

    const allSkills = await db.select().from(skillsTable);
    const activeSkills = allSkills.length;

    const allNotifications = await db.select().from(notificationsTable);
    const recentNotifications = allNotifications.filter(n => !n.isRead).length;

    // Enrollments by status
    const statusMap: Record<string, number> = {};
    allEnrollments.forEach(e => {
      statusMap[e.status] = (statusMap[e.status] || 0) + 1;
    });
    const enrollmentsByStatus = Object.entries(statusMap).map(([status, c]) => ({ status, count: c }));

    // Recent activity (last 10 unread notifications)
    const recentActivity = allNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(n => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt,
      }));

    res.json({
      totalParticipants,
      totalOfficers,
      pendingPayments,
      approvedEnrollments,
      activeSkills,
      recentNotifications,
      enrollmentsByStatus,
      recentActivity,
    });
  } catch (err) {
    logger.error({ err }, "Error getting dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
