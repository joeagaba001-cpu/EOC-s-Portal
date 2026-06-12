import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cateringOrdersTable = pgTable("catering_orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  eventType: text("event_type").notNull(),
  eventDate: text("event_date"),
  guestCount: integer("guest_count"),
  eventAddress: text("event_address").notNull(),
  menuItems: text("menu_items"),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"),
  officerNotes: text("officer_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCateringOrderSchema = createInsertSchema(cateringOrdersTable).omit({
  id: true,
  createdAt: true,
  status: true,
  officerNotes: true,
});
export type InsertCateringOrder = z.infer<typeof insertCateringOrderSchema>;
export type CateringOrder = typeof cateringOrdersTable.$inferSelect;
