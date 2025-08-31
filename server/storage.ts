import {
  users,
  tips,
  userTipHistory,
  type User,
  type UpsertUser,
  type Tip,
  type InsertTip,
  type UserTipHistory,
  type InsertUserTipHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserSubscription(userId: string, plan: string, status: string, expiry?: Date): Promise<User>;
  
  // Tip operations
  getTips(limit?: number, sport?: string, status?: string, requiredPlan?: string): Promise<Tip[]>;
  getTip(id: string): Promise<Tip | undefined>;
  createTip(tip: InsertTip, submittedBy: string): Promise<Tip>;
  updateTipStatus(tipId: string, status: string, result?: string, profit?: string): Promise<Tip>;
  getTipsByUser(userId: string): Promise<Tip[]>;
  
  // User tip history operations
  followTip(userTipHistory: InsertUserTipHistory): Promise<UserTipHistory>;
  getUserTipHistory(userId: string): Promise<UserTipHistory[]>;
  
  // Performance stats
  getUserStats(userId: string): Promise<{
    totalProfit: number;
    winRate: number;
    totalBets: number;
    roi: number;
  }>;
  
  getTipsterStats(): Promise<{
    winRate: number;
    totalTips: number;
    totalMembers: number;
    weeklyStats: {
      wins: number;
      losses: number;
      profit: number;
    };
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, plan: string, status: string, expiry?: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionPlan: plan,
        subscriptionStatus: status,
        subscriptionExpiry: expiry,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getTips(limit = 50, sport?: string, status?: string, requiredPlan?: string): Promise<Tip[]> {
    let query = db.select().from(tips);
    
    const conditions = [];
    if (sport) conditions.push(eq(tips.sport, sport as any));
    if (status) conditions.push(eq(tips.status, status as any));
    if (requiredPlan) conditions.push(eq(tips.requiredPlan, requiredPlan));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(desc(tips.createdAt))
      .limit(limit);
  }

  async getTip(id: string): Promise<Tip | undefined> {
    const [tip] = await db.select().from(tips).where(eq(tips.id, id));
    return tip;
  }

  async createTip(tip: InsertTip, submittedBy: string): Promise<Tip> {
    const [newTip] = await db
      .insert(tips)
      .values({
        ...tip,
        submittedBy,
      })
      .returning();
    return newTip;
  }

  async updateTipStatus(tipId: string, status: string, result?: string, profit?: string): Promise<Tip> {
    const [tip] = await db
      .update(tips)
      .set({
        status: status as any,
        result,
        profit,
        updatedAt: new Date(),
      })
      .where(eq(tips.id, tipId))
      .returning();
    return tip;
  }

  async getTipsByUser(userId: string): Promise<Tip[]> {
    return await db
      .select()
      .from(tips)
      .where(eq(tips.submittedBy, userId))
      .orderBy(desc(tips.createdAt));
  }

  async followTip(userTipHistory: InsertUserTipHistory): Promise<UserTipHistory> {
    const [history] = await db
      .insert(userTipHistory)
      .values(userTipHistory)
      .returning();
    return history;
  }

  async getUserTipHistory(userId: string): Promise<UserTipHistory[]> {
    return await db
      .select()
      .from(userTipHistory)
      .where(eq(userTipHistory.userId, userId))
      .orderBy(desc(userTipHistory.followedAt));
  }

  async getUserStats(userId: string): Promise<{
    totalProfit: number;
    winRate: number;
    totalBets: number;
    roi: number;
  }> {
    const history = await this.getUserTipHistory(userId);
    const completedBets = history.filter(h => h.profit !== null);
    
    const totalProfit = completedBets.reduce((sum, h) => sum + Number(h.profit || 0), 0);
    const totalStake = completedBets.reduce((sum, h) => sum + Number(h.stake), 0);
    const wins = completedBets.filter(h => Number(h.profit || 0) > 0).length;
    const winRate = completedBets.length > 0 ? (wins / completedBets.length) * 100 : 0;
    const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;

    return {
      totalProfit,
      winRate: Math.round(winRate * 100) / 100,
      totalBets: completedBets.length,
      roi: Math.round(roi * 100) / 100,
    };
  }

  async getTipsterStats(): Promise<{
    winRate: number;
    totalTips: number;
    totalMembers: number;
    weeklyStats: {
      wins: number;
      losses: number;
      profit: number;
    };
  }> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get total tips
    const [totalTipsResult] = await db
      .select({ count: count() })
      .from(tips);

    // Get completed tips for win rate
    const completedTips = await db
      .select()
      .from(tips)
      .where(and(
        eq(tips.status, "won"),
        eq(tips.status, "lost")
      ));

    const wonTips = completedTips.filter(t => t.status === "won").length;
    const totalCompleted = completedTips.length;

    // Get weekly stats
    const weeklyTips = await db
      .select()
      .from(tips)
      .where(gte(tips.createdAt, weekAgo));

    const weeklyWins = weeklyTips.filter(t => t.status === "won").length;
    const weeklyLosses = weeklyTips.filter(t => t.status === "lost").length;
    const weeklyProfit = weeklyTips
      .filter(t => t.profit !== null)
      .reduce((sum, t) => sum + Number(t.profit || 0), 0);

    // Get total members
    const [totalMembersResult] = await db
      .select({ count: count() })
      .from(users);

    return {
      winRate: totalCompleted > 0 ? Math.round((wonTips / totalCompleted) * 100 * 100) / 100 : 0,
      totalTips: totalTipsResult.count,
      totalMembers: totalMembersResult.count,
      weeklyStats: {
        wins: weeklyWins,
        losses: weeklyLosses,
        profit: Math.round(weeklyProfit * 100) / 100,
      },
    };
  }
}

export const storage = new DatabaseStorage();
