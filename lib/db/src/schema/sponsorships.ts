import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sponsorshipsTable = pgTable("sponsorships", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  organization: text("organization"),
  email: text("email"),
  phone: text("phone").notNull(),
  sponsorshipType: text("sponsorship_type").notNull(),
  donationAmount: integer("donation_amount"),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSponsorshipSchema = createInsertSchema(sponsorshipsTable).omit({ id: true, createdAt: true, status: true });
export type InsertSponsorship = z.infer<typeof insertSponsorshipSchema>;
export type Sponsorship = typeof sponsorshipsTable.$inferSelect;
