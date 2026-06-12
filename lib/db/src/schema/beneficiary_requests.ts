import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const beneficiaryRequestsTable = pgTable("beneficiary_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  fullName: text("full_name").notNull(),
  participantId: text("participant_id"),
  reason: text("reason").notNull(),
  amountRequested: integer("amount_requested").notNull(),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountName: text("account_name"),
  supportingDocs: text("supporting_docs"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected | disbursed
  officerNotes: text("officer_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBeneficiaryRequestSchema = createInsertSchema(beneficiaryRequestsTable).omit({ id: true, createdAt: true, updatedAt: true, status: true, officerNotes: true });
export type InsertBeneficiaryRequest = z.infer<typeof insertBeneficiaryRequestSchema>;
export type BeneficiaryRequest = typeof beneficiaryRequestsTable.$inferSelect;
