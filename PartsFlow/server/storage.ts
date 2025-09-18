import { 
  type Supplier, 
  type InsertSupplier,
  type Category,
  type InsertCategory,
  type Part,
  type InsertPart,
  type Movement,
  type InsertMovement,
  type PartWithDetails,
  type MovementWithPart,
  type Report,
  type InsertReport
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier>;
  deleteSupplier(id: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;

  // Parts
  getParts(): Promise<PartWithDetails[]>;
  getPart(id: string): Promise<PartWithDetails | undefined>;
  getPartByPartNumber(partNumber: string): Promise<PartWithDetails | undefined>;
  createPart(part: InsertPart): Promise<Part>;
  updatePart(id: string, part: Partial<InsertPart>): Promise<Part>;
  deletePart(id: string): Promise<boolean>;
  searchParts(query: string): Promise<PartWithDetails[]>;
  getLowStockParts(): Promise<PartWithDetails[]>;

  // Movements
  getMovements(): Promise<MovementWithPart[]>;
  getMovement(id: string): Promise<MovementWithPart | undefined>;
  getMovementsByPart(partId: string): Promise<MovementWithPart[]>;
  createMovement(movement: InsertMovement): Promise<Movement>;

  // Stats
  getInventoryStats(): Promise<{
    totalParts: number;
    lowStockCount: number;
    totalValue: number;
    activeSuppliers: number;
  }>;

  // Reports
  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
}

export class MemStorage implements IStorage {
  private suppliers: Map<string, Supplier>;
  private categories: Map<string, Category>;
  private parts: Map<string, Part>;
  private movements: Map<string, Movement>;
  private reports: Map<string, Report>;

  constructor() {
    this.suppliers = new Map();
    this.categories = new Map();
    this.parts = new Map();
    this.movements = new Map();
    this.reports = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some default categories and suppliers
    const defaultCategories = [
      { name: "Engine Parts", description: "Engine components and accessories" },
      { name: "Braking System", description: "Brake pads, discs, and hydraulics" },
      { name: "Transmission", description: "Transmission parts and fluids" },
      { name: "Hydraulics", description: "Hydraulic pumps, hoses, and cylinders" },
      { name: "Electrical", description: "Electrical components and wiring" },
      { name: "Fuel System", description: "Fuel injectors, filters, and pumps" },
    ];

    const defaultSuppliers = [
      { name: "AutoParts Co.", contactEmail: "info@autoparts.com", contactPhone: "+1-555-0123" },
      { name: "EngineMax Ltd.", contactEmail: "sales@enginemax.com", contactPhone: "+1-555-0124" },
      { name: "HydroSystems", contactEmail: "orders@hydrosystems.com", contactPhone: "+1-555-0125" },
      { name: "TransParts Inc.", contactEmail: "support@transparts.com", contactPhone: "+1-555-0126" },
      { name: "FuelTech Pro", contactEmail: "contact@fueltech.com", contactPhone: "+1-555-0127" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = { 
        id: randomUUID(), 
        description: cat.description || null,
        ...cat 
      };
      this.categories.set(category.id, category);
    });

    defaultSuppliers.forEach(sup => {
      const supplier: Supplier = { 
        id: randomUUID(), 
        address: null, 
        contactEmail: sup.contactEmail || null,
        contactPhone: sup.contactPhone || null,
        ...sup 
      };
      this.suppliers.set(supplier.id, supplier);
    });

    // Add some sample parts for testing
    this.initializeSampleParts();
  }

  private initializeSampleParts() {
    const categories = Array.from(this.categories.values());
    const suppliers = Array.from(this.suppliers.values());
    
    const sampleParts = [
      {
        name: "Air Filter Heavy Duty",
        partNumber: "AF-HD-001",
        description: "High-performance air filter for heavy vehicles",
        quantity: 25,
        minimumStock: 10,
        unitPrice: "45.99",
        location: "A1-B2-C3"
      },
      {
        name: "Brake Pad Set Front",
        partNumber: "BP-F-002", 
        description: "Front brake pad set for heavy duty trucks",
        quantity: 8,
        minimumStock: 12,
        unitPrice: "89.50",
        location: "B2-C3-D4"
      },
      {
        name: "Hydraulic Pump",
        partNumber: "HP-001",
        description: "Main hydraulic pump for lifting systems",
        quantity: 3,
        minimumStock: 5,
        unitPrice: "450.00",
        location: "C1-A2-B3"
      },
      {
        name: "Engine Oil Filter",
        partNumber: "OF-ENG-003",
        description: "Premium engine oil filter",
        quantity: 0,
        minimumStock: 15,
        unitPrice: "28.75",
        location: "A2-B1-C2"
      }
    ];

    sampleParts.forEach((partData, index) => {
      const part: Part = {
        ...partData,
        id: randomUUID(),
        categoryId: categories[index % categories.length]?.id || null,
        supplierId: suppliers[index % suppliers.length]?.id || null,
        description: partData.description || null,
        location: partData.location || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.parts.set(part.id, part);
    });
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, supplierData: Partial<InsertSupplier>): Promise<Supplier> {
    const existing = this.suppliers.get(id);
    if (!existing) throw new Error("Supplier not found");
    
    const updated = { ...existing, ...supplierData };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, categoryData: Partial<InsertCategory>): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) throw new Error("Category not found");
    
    const updated = { ...existing, ...categoryData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Parts
  async getParts(): Promise<PartWithDetails[]> {
    const partsArray = Array.from(this.parts.values());
    return partsArray.map(part => this.enrichPartWithDetails(part));
  }

  async getPart(id: string): Promise<PartWithDetails | undefined> {
    const part = this.parts.get(id);
    return part ? this.enrichPartWithDetails(part) : undefined;
  }

  async getPartByPartNumber(partNumber: string): Promise<PartWithDetails | undefined> {
    const part = Array.from(this.parts.values()).find(p => p.partNumber === partNumber);
    return part ? this.enrichPartWithDetails(part) : undefined;
  }

  async createPart(insertPart: InsertPart): Promise<Part> {
    const id = randomUUID();
    const now = new Date();
    const part: Part = { 
      ...insertPart,
      description: insertPart.description || null,
      categoryId: insertPart.categoryId || null,
      supplierId: insertPart.supplierId || null,
      location: insertPart.location || null,
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.parts.set(id, part);
    return part;
  }

  async updatePart(id: string, partData: Partial<InsertPart>): Promise<Part> {
    const existing = this.parts.get(id);
    if (!existing) throw new Error("Part not found");
    
    const updated = { ...existing, ...partData, updatedAt: new Date() };
    this.parts.set(id, updated);
    return updated;
  }

  async deletePart(id: string): Promise<boolean> {
    return this.parts.delete(id);
  }

  async searchParts(query: string): Promise<PartWithDetails[]> {
    const parts = Array.from(this.parts.values());
    const filtered = parts.filter(part => 
      part.name.toLowerCase().includes(query.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(query.toLowerCase()) ||
      (part.description && part.description.toLowerCase().includes(query.toLowerCase()))
    );
    return filtered.map(part => this.enrichPartWithDetails(part));
  }

  async getLowStockParts(): Promise<PartWithDetails[]> {
    const parts = Array.from(this.parts.values());
    const lowStock = parts.filter(part => part.quantity <= part.minimumStock);
    return lowStock.map(part => this.enrichPartWithDetails(part));
  }

  // Movements
  async getMovements(): Promise<MovementWithPart[]> {
    const movementsArray = Array.from(this.movements.values());
    return movementsArray.map(movement => {
      const part = this.parts.get(movement.partId);
      return { ...movement, part: part! };
    }).filter(m => m.part);
  }

  async getMovement(id: string): Promise<MovementWithPart | undefined> {
    const movement = this.movements.get(id);
    if (!movement) return undefined;
    
    const part = this.parts.get(movement.partId);
    return part ? { ...movement, part } : undefined;
  }

  async getMovementsByPart(partId: string): Promise<MovementWithPart[]> {
    const movements = Array.from(this.movements.values()).filter(m => m.partId === partId);
    return movements.map(movement => {
      const part = this.parts.get(movement.partId);
      return { ...movement, part: part! };
    }).filter(m => m.part);
  }

  async createMovement(insertMovement: InsertMovement): Promise<Movement> {
    const id = randomUUID();
    const movement: Movement = { 
      ...insertMovement,
      reason: insertMovement.reason || null,
      id, 
      createdAt: new Date() 
    };
    this.movements.set(id, movement);
    
    // Update part quantity
    const part = this.parts.get(insertMovement.partId);
    if (part) {
      const quantityChange = insertMovement.type === 'in' ? insertMovement.quantity : -insertMovement.quantity;
      const updatedPart = { 
        ...part, 
        quantity: Math.max(0, part.quantity + quantityChange),
        updatedAt: new Date()
      };
      this.parts.set(part.id, updatedPart);
    }
    
    return movement;
  }

  // Stats
  async getInventoryStats(): Promise<{
    totalParts: number;
    lowStockCount: number;
    totalValue: number;
    activeSuppliers: number;
  }> {
    const parts = Array.from(this.parts.values());
    const suppliers = Array.from(this.suppliers.values());
    
    const totalParts = parts.length;
    const lowStockCount = parts.filter(p => p.quantity <= p.minimumStock).length;
    const totalValue = parts.reduce((sum, part) => sum + (part.quantity * parseFloat(part.unitPrice)), 0);
    const activeSuppliers = suppliers.length;
    
    return {
      totalParts,
      lowStockCount,
      totalValue,
      activeSuppliers
    };
  }

  // Reports methods
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createReport(report: InsertReport): Promise<Report> {
    const newReport: Report = {
      id: randomUUID(),
      ...report,
      createdAt: new Date(),
    };
    
    this.reports.set(newReport.id, newReport);
    return newReport;
  }

  private enrichPartWithDetails(part: Part): PartWithDetails {
    const category = part.categoryId ? this.categories.get(part.categoryId) : undefined;
    const supplier = part.supplierId ? this.suppliers.get(part.supplierId) : undefined;
    
    let stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
    if (part.quantity === 0) {
      stockStatus = 'out-of-stock';
    } else if (part.quantity <= part.minimumStock) {
      stockStatus = 'low-stock';
    } else {
      stockStatus = 'in-stock';
    }
    
    return {
      ...part,
      category,
      supplier,
      stockStatus
    };
  }
}

export const storage = new MemStorage();
