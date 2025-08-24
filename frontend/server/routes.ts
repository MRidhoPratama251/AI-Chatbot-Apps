import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertConversationSchema,
  insertMessageSchema,
  insertTokenUsageSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (for demo purposes, we'll use user ID 1)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user
  app.patch("/api/user", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(1, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations(1);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  // Create conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse({
        ...req.body,
        userId: 1
      });
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Update conversation
  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const conversation = await storage.updateConversation(id, updates);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteConversation(id);
      if (!success) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json({ message: "Conversation deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Create message
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const data = insertMessageSchema.parse({
        ...req.body,
        conversationId
      });
      const message = await storage.createMessage(data);
      
      // If this is the first user message, update conversation title
      if (data.role === "user") {
        const existingMessages = await storage.getMessages(conversationId);
        const userMessages = existingMessages.filter(msg => msg.role === "user");
        
        // If this is the first user message, update the conversation title
        if (userMessages.length === 1) {
          const truncatedTitle = data.content.length > 50 
            ? data.content.substring(0, 50) + "..."
            : data.content;
          
          await storage.updateConversation(conversationId, {
            title: truncatedTitle
          });
        }
        
        // Create template AI response
        setTimeout(async () => {
          await storage.createMessage({
            conversationId,
            content: `Hello, this is an AI response simulation. Are you asking about "${data.content}"?`,
            role: "assistant",
            attachments: null
          });
        }, 1000);
      }
      
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Get token usage
  app.get("/api/token-usage", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const usage = await storage.getTokenUsage(1, start, end);
      res.json(usage);
    } catch (error) {
      res.status(500).json({ message: "Failed to get token usage" });
    }
  });

  // Create token usage
  app.post("/api/token-usage", async (req, res) => {
    try {
      const data = insertTokenUsageSchema.parse({
        ...req.body,
        userId: 1
      });
      const usage = await storage.createTokenUsage(data);
      res.json(usage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create token usage" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
