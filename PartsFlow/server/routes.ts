import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPartSchema, insertSupplierSchema, insertCategorySchema, insertMovementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Parts routes
  app.get("/api/parts", async (req, res) => {
    try {
      const { search } = req.query;
      let parts;
      
      if (search && typeof search === 'string') {
        parts = await storage.searchParts(search);
      } else {
        parts = await storage.getParts();
      }
      
      res.json(parts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parts" });
    }
  });

  app.get("/api/parts/low-stock", async (req, res) => {
    try {
      const parts = await storage.getLowStockParts();
      res.json(parts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock parts" });
    }
  });

  app.get("/api/parts/:id", async (req, res) => {
    try {
      const part = await storage.getPart(req.params.id);
      if (!part) {
        return res.status(404).json({ message: "Part not found" });
      }
      res.json(part);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch part" });
    }
  });

  app.post("/api/parts", async (req, res) => {
    try {
      const validatedData = insertPartSchema.parse(req.body);
      const part = await storage.createPart(validatedData);
      res.status(201).json(part);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create part" });
    }
  });

  app.put("/api/parts/:id", async (req, res) => {
    try {
      const validatedData = insertPartSchema.partial().parse(req.body);
      const part = await storage.updatePart(req.params.id, validatedData);
      res.json(part);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update part" });
    }
  });

  app.delete("/api/parts/:id", async (req, res) => {
    try {
      const success = await storage.deletePart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Part not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete part" });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Movements routes
  app.get("/api/movements", async (req, res) => {
    try {
      const movements = await storage.getMovements();
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movements" });
    }
  });

  app.get("/api/movements/part/:partId", async (req, res) => {
    try {
      const movements = await storage.getMovementsByPart(req.params.partId);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch part movements" });
    }
  });

  app.post("/api/movements", async (req, res) => {
    try {
      const validatedData = insertMovementSchema.parse(req.body);
      const movement = await storage.createMovement(validatedData);
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create movement" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getInventoryStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Reports routes
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const report = await storage.createReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
