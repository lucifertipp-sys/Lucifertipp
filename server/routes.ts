import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTipSchema, insertUserTipHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tips routes
  app.get('/api/tips', async (req, res) => {
    try {
      const { sport, status, plan, limit } = req.query;
      const tips = await storage.getTips(
        limit ? parseInt(limit as string) : undefined,
        sport as string,
        status as string,
        plan as string
      );
      res.json(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  app.get('/api/tips/:id', async (req, res) => {
    try {
      const tip = await storage.getTip(req.params.id);
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }
      res.json(tip);
    } catch (error) {
      console.error("Error fetching tip:", error);
      res.status(500).json({ message: "Failed to fetch tip" });
    }
  });

  app.post('/api/tips', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Only admins can create tips" });
      }

      const tipData = insertTipSchema.parse(req.body);
      const tip = await storage.createTip(tipData, userId);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tip data", errors: error.errors });
      }
      console.error("Error creating tip:", error);
      res.status(500).json({ message: "Failed to create tip" });
    }
  });

  app.patch('/api/tips/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Only admins can update tip status" });
      }

      const { status, result, profit } = req.body;
      const tip = await storage.updateTipStatus(req.params.id, status, result, profit);
      res.json(tip);
    } catch (error) {
      console.error("Error updating tip status:", error);
      res.status(500).json({ message: "Failed to update tip status" });
    }
  });

  // User tip history routes
  app.post('/api/user/follow-tip', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const historyData = insertUserTipHistorySchema.parse({
        ...req.body,
        userId,
      });
      
      const history = await storage.followTip(historyData);
      res.status(201).json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error following tip:", error);
      res.status(500).json({ message: "Failed to follow tip" });
    }
  });

  app.get('/api/user/tip-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserTipHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching user tip history:", error);
      res.status(500).json({ message: "Failed to fetch tip history" });
    }
  });

  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Subscription routes
  app.post('/api/subscription/update', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { plan, status, expiry } = req.body;
      
      const user = await storage.updateUserSubscription(
        userId, 
        plan, 
        status, 
        expiry ? new Date(expiry) : undefined
      );
      res.json(user);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Public stats
  app.get('/api/stats/tipster', async (req, res) => {
    try {
      const stats = await storage.getTipsterStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching tipster stats:", error);
      res.status(500).json({ message: "Failed to fetch tipster stats" });
    }
  });

  // Admin routes
  app.get('/api/admin/tips', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const tips = await storage.getTipsByUser(userId);
      res.json(tips);
    } catch (error) {
      console.error("Error fetching admin tips:", error);
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
