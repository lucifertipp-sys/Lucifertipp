import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionPlan: varchar("subscription_plan").default("free"), // free, basic, pro, vip
  subscriptionStatus: varchar("subscription_status").default("inactive"), // active, inactive, cancelled
  subscriptionExpiry: timestamp("subscription_expiry"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sports enum
export const sportEnum = pgEnum("sport", [
  "nfl",
  "nba", 
  "nhl",
  "mlb",
  "soccer",
  "tennis",
  "golf",
  "boxing",
  "mma",
  "other"
]);

// Tip status enum
export const tipStatusEnum = pgEnum("tip_status", [
  "pending",
  "won",
  "lost",
  "void",
  "cancelled"
]);

// Tips table
export const tips = pgTable("tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sport: sportEnum("sport").notNull(),
  league: varchar("league").notNull(),
  matchup: varchar("matchup").notNull(), // e.g., "Lakers vs Warriors"
  betType: varchar("bet_type").notNull(), // e.g., "Over 48.5 Points", "Lakers +7.5"
  odds: varchar("odds").notNull(), // e.g., "-110", "+140"
  stake: decimal("stake", { precision: 10, scale: 2 }).default("100.00"),
  analysis: text("analysis"), // Detailed analysis of the tip
  confidence: integer("confidence").default(7), // 1-10 scale
  status: tipStatusEnum("status").default("pending"),
  result: text("result"), // Final score or outcome
  profit: decimal("profit", { precision: 10, scale: 2 }), // Actual profit/loss
  gameDate: timestamp("game_date"),
  submittedBy: varchar("submitted_by").references(() => users.id),
  requiredPlan: varchar("required_plan").default("free"), // free, basic, pro, vip
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User tips tracking (for performance stats)
export const userTipHistory = pgTable("user_tip_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tipId: varchar("tip_id").references(() => tips.id).notNull(),
  stake: decimal("stake", { precision: 10, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 10, scale: 2 }),
  followedAt: timestamp("followed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tips: many(tips),
  tipHistory: many(userTipHistory),
}));

export const tipsRelations = relations(tips, ({ one, many }) => ({
  submittedBy: one(users, {
    fields: [tips.submittedBy],
    references: [users.id],
  }),
  userHistory: many(userTipHistory),
}));

export const userTipHistoryRelations = relations(userTipHistory, ({ one }) => ({
  user: one(users, {
    fields: [userTipHistory.userId],
    references: [users.id],
  }),
  tip: one(tips, {
    fields: [userTipHistory.tipId],
    references: [tips.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedBy: true,
});

export const insertUserTipHistorySchema = createInsertSchema(userTipHistory).omit({
  id: true,
  followedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tips.$inferSelect;
export type InsertUserTipHistory = z.infer<typeof insertUserTipHistorySchema>;
export type UserTipHistory = typeof userTipHistory.$inferSelect;
