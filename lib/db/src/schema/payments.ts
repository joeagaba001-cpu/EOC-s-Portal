import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { enrollmentsTable } from "./enrollments";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollmentsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  proofUrl: text("proof_url").notNull(),
  fileName: text("file_name").notNull(),
  status: text("status").notNull().default("pending"), // pending | confirmed | rejected
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, uploadedAt: true, reviewedAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
