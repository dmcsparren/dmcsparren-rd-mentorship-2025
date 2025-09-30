import { 
  users, InsertUser, User,
  inventoryItems, InsertInventoryItem, InventoryItem,
  equipment, InsertEquipment, Equipment,
  recipes, InsertRecipe, Recipe,
  brewingSchedules, InsertBrewingSchedule, BrewingSchedule,
  breweries, InsertBrewery, Brewery,
  ingredientSources, InsertIngredientSource, IngredientSource,
  ingredientPriceHistory, InsertIngredientPriceHistory, IngredientPriceHistory
} from "@shared/schema";
import { IStorage } from "./storage-interface";

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private inventory: Map<number, InventoryItem>;
  private equipment: Map<number, Equipment>;
  private recipes: Map<number, Recipe>;
  private schedules: Map<number, BrewingSchedule>;
  private breweries: Map<string, Brewery>;
  
  private userId: number;
  private inventoryId: number;
  private equipmentId: number;
  private recipeId: number;
  private scheduleId: number;
  
  constructor() {
    this.users = new Map();
    this.inventory = new Map();
    this.equipment = new Map();
    this.recipes = new Map();
    this.schedules = new Map();
    this.breweries = new Map();
    
    this.userId = 1;
    this.inventoryId = 1;
    this.equipmentId = 1;
    this.recipeId = 1;
    this.scheduleId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId.toString();
    const now = new Date();
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      role: insertUser.role || 'member',
      breweryId: null,
      profileImageUrl: null,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    this.userId++;
    return user;
  }
  
  async upsertUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  // Inventory operations
  async getInventoryItems(breweryId?: string): Promise<InventoryItem[]> {
    const items = Array.from(this.inventory.values());
    if (breweryId) {
      return items.filter(item => item.breweryId === breweryId);
    }
    return items;
  }
  
  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }
  
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryId++;
    const now = new Date();
    const inventoryItem: InventoryItem = {
      id,
      name: item.name,
      quantity: parseInt(item.quantity.toString()),
      currentQuantity: parseInt(item.currentQuantity.toString()),
      minimumQuantity: parseInt(item.minimumQuantity.toString()),
      unit: item.unit,
      location: item.location || null,
      notes: item.notes || null,
      imageUrl: item.imageUrl || null,
      category: item.category || null,
      expirationDate: item.expirationDate || null,
      cost: item.cost || null,
      supplier: item.supplier || null,
      barcode: item.barcode || null,
      breweryId: null,
      createdAt: now,
      updatedAt: now
    };
    this.inventory.set(id, inventoryItem);
    return inventoryItem;
  }
  
  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...item };
    this.inventory.set(id, updated);
    return updated;
  }
  
  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }
  
  // Equipment operations
  async getAllEquipment(breweryId?: string): Promise<Equipment[]> {
    const items = Array.from(this.equipment.values());
    if (breweryId) {
      return items.filter(item => item.breweryId === breweryId);
    }
    return items;
  }
  
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }
  
  async createEquipment(equipmentItem: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentId++;
    const now = new Date();
    const newEquipment: Equipment = {
      id,
      name: equipmentItem.name,
      type: equipmentItem.type,
      location: equipmentItem.location || null,
      capacity: equipmentItem.capacity || null,
      status: equipmentItem.status || "available",
      purchaseDate: equipmentItem.purchaseDate || null,
      lastMaintenance: equipmentItem.lastMaintenance || null,
      nextMaintenance: equipmentItem.nextMaintenance || null,
      notes: equipmentItem.notes || null,
      imageUrl: equipmentItem.imageUrl || null,
      breweryId: null,
      createdAt: now,
      updatedAt: now
    };
    this.equipment.set(id, newEquipment);
    return newEquipment;
  }
  
  async updateEquipment(id: number, equipmentItem: Partial<Equipment>): Promise<Equipment | undefined> {
    const existing = this.equipment.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...equipmentItem };
    this.equipment.set(id, updated);
    return updated;
  }
  
  async deleteEquipment(id: number): Promise<boolean> {
    return this.equipment.delete(id);
  }
  
  // Recipe operations
  async getAllRecipes(breweryId?: string): Promise<Recipe[]> {
    const items = Array.from(this.recipes.values());
    if (breweryId) {
      return items.filter(item => item.breweryId === breweryId);
    }
    return items;
  }
  
  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }
  
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeId++;
    const now = new Date();
    const newRecipe: Recipe = {
      id,
      name: recipe.name,
      style: recipe.style || null,
      batchSize: recipe.batchSize || null,
      targetAbv: recipe.targetAbv || null,
      targetIbu: recipe.targetIbu || null,
      ingredients: recipe.ingredients || null,
      instructions: recipe.instructions || null,
      fermentationTemp: recipe.fermentationTemp || null,
      fermentationTime: recipe.fermentationTime || null,
      notes: recipe.notes || null,
      imageUrl: recipe.imageUrl || null,
      breweryId: null,
      createdAt: now,
      updatedAt: now
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }
  
  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined> {
    const existing = this.recipes.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...recipe };
    this.recipes.set(id, updated);
    return updated;
  }
  
  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }
  
  // Brewing schedule operations
  async getAllBrewingSchedules(breweryId?: string): Promise<BrewingSchedule[]> {
    const items = Array.from(this.schedules.values());
    if (breweryId) {
      return items.filter(item => item.breweryId === breweryId);
    }
    return items;
  }
  
  async getBrewingSchedule(id: number): Promise<BrewingSchedule | undefined> {
    return this.schedules.get(id);
  }
  
  async createBrewingSchedule(schedule: InsertBrewingSchedule): Promise<BrewingSchedule> {
    const id = this.scheduleId++;
    const now = new Date();
    const newSchedule: BrewingSchedule = {
      id,
      title: schedule.title,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      status: schedule.status || "scheduled",
      batchSize: schedule.batchSize || null,
      description: schedule.description || null,
      notes: schedule.notes || null,
      recipeId: schedule.recipeId || null,
      equipmentId: schedule.equipmentId || null,
      breweryId: null,
      createdAt: now,
      updatedAt: now
    };
    this.schedules.set(id, newSchedule);
    return newSchedule;
  }
  
  async updateBrewingSchedule(id: number, schedule: Partial<BrewingSchedule>): Promise<BrewingSchedule | undefined> {
    const existing = this.schedules.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...schedule };
    this.schedules.set(id, updated);
    return updated;
  }
  
  async deleteBrewingSchedule(id: number): Promise<boolean> {
    return this.schedules.delete(id);
  }
  
  // Brewery operations
  async createBrewery(brewery: InsertBrewery): Promise<Brewery> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newBrewery: Brewery = {
      id,
      name: brewery.name,
      type: brewery.type,
      location: brewery.location,
      foundedYear: brewery.foundedYear || null,
      website: brewery.website || null,
      phone: brewery.phone || null,
      brewingCapacity: brewery.brewingCapacity || null,
      specialties: brewery.specialties || null,
      createdAt: now,
      updatedAt: now
    };
    this.breweries.set(id, newBrewery);
    return newBrewery;
  }
  
  async getBrewery(id: string): Promise<Brewery | undefined> {
    return this.breweries.get(id);
  }
  
  async updateBrewery(id: string, brewery: Partial<Brewery>): Promise<Brewery> {
    const existingBrewery = this.breweries.get(id);
    if (!existingBrewery) {
      throw new Error(`Brewery with id ${id} not found`);
    }
    const updatedBrewery = { ...existingBrewery, ...brewery, updatedAt: new Date() };
    this.breweries.set(id, updatedBrewery);
    return updatedBrewery;
  }
  
  async deleteBrewery(id: string): Promise<void> {
    this.breweries.delete(id);
  }
  
  async listBreweries(): Promise<Brewery[]> {
    return Array.from(this.breweries.values());
  }
  
  async addUserToBrewery(userId: string, breweryId: string, role: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    const brewery = this.breweries.get(breweryId);
    if (!brewery) {
      throw new Error(`Brewery with id ${breweryId} not found`);
    }
    const updatedUser = { ...user, breweryId, role, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async removeUserFromBrewery(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    const updatedUser = { ...user, breweryId: null, role: 'member', updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async listBreweryUsers(breweryId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.breweryId === breweryId);
  }
  
  async initializeBreweryData(breweryId: string): Promise<void> {
    // Initialize brewery account - data will be added by users through the interface
    console.log(`Brewery ${breweryId} initialized successfully`);
  }
  
  async getAllIngredientSources(): Promise<IngredientSource[]> {
    return [];
  }
  
  async getIngredientSource(id: number): Promise<IngredientSource | undefined> {
    return undefined;
  }
  
  async createIngredientSource(source: InsertIngredientSource): Promise<IngredientSource> {
    throw new Error("Not implemented");
  }
  
  async updateIngredientSource(id: number, source: Partial<IngredientSource>): Promise<IngredientSource | undefined> {
    throw new Error("Not implemented");
  }
  
  async deleteIngredientSource(id: number): Promise<boolean> {
    return false;
  }
  
  // Price history operations
  async getPriceHistoryForIngredient(ingredientId: number): Promise<IngredientPriceHistory[]> {
    return [];
  }

  async getAllPriceHistory(): Promise<IngredientPriceHistory[]> {
    return [];
  }

  async addPriceHistoryEntry(entry: InsertIngredientPriceHistory): Promise<IngredientPriceHistory> {
    throw new Error("Not implemented");
  }

  async updatePriceHistoryEntry(id: number, entry: Partial<IngredientPriceHistory>): Promise<IngredientPriceHistory | undefined> {
    throw new Error("Not implemented");
  }

  async deletePriceHistoryEntry(id: number): Promise<boolean> {
    return false;
  }
  
  // Initialize sample data
  private initializeData() {
    // Create a sample user
    const sampleUser: User = {
      id: this.userId.toString(),
      username: "sam",
      email: "sam@brewery.com",
      password: "password",
      firstName: "Sam",
      lastName: "Brewer",
      role: "Brewmaster",
      breweryId: null,
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(sampleUser.id, sampleUser);
    this.userId++;
    
    // Create sample inventory items
    const sampleInventory: InsertInventoryItem[] = [
      {
        name: "Cascade Hops",
        quantity: 5,
        unit: "kg",
        category: "Hops",
        location: "Storage A",
        notes: "Critical level",
        imageUrl: null,
        expirationDate: null,
        cost: "15.99",
        supplier: "Hop Supplier Inc",
        barcode: "123456789"
      },
      {
        name: "Pilsner Malt",
        quantity: 75,
        unit: "kg",
        category: "Malt",
        location: "Storage B",
        notes: "Warning level",
        imageUrl: null,
        expirationDate: null,
        cost: "3.99",
        supplier: "Malt House",
        barcode: "987654321"
      }
    ];
    
    sampleInventory.forEach(item => this.createInventoryItem(item));
    
    // Create sample equipment
    const sampleEquipment: InsertEquipment[] = [
      {
        name: "Brew Kettle #1",
        type: "kettle",
        location: "Brewhouse",
        capacity: "500L",
        status: "active",
        purchaseDate: new Date("2023-01-01"),
        lastMaintenance: new Date("2024-01-01"),
        nextMaintenance: new Date("2024-07-01"),
        notes: "Regular maintenance required",
        imageUrl: null
      },
      {
        name: "Fermenter #2",
        type: "fermenter",
        location: "Fermentation Room",
        capacity: "1000L",
        status: "active",
        purchaseDate: new Date("2023-02-01"),
        lastMaintenance: new Date("2024-01-15"),
        nextMaintenance: new Date("2024-07-15"),
        notes: "Temperature control working properly",
        imageUrl: null
      }
    ];
    
    sampleEquipment.forEach(item => this.createEquipment(item));
    
    // Create sample recipes
    const sampleRecipes: InsertRecipe[] = [
      {
        name: "Summer Kolsch",
        style: "Kolsch",
        batchSize: "500",
        targetAbv: "4.8",
        targetIbu: 22,
        ingredients: JSON.parse('["Pilsner Malt", "Vienna Malt", "Cascade Hops", "Kolsch Yeast"]'),
        instructions: "Mash at 152°F for 60 minutes, Boil for 60 minutes, Ferment at 60°F for 10 days",
        fermentationTemp: "60°F",
        fermentationTime: "10 days",
        notes: "Light, crisp and refreshing German-style ale perfect for summer",
        imageUrl: null
      },
      {
        name: "Vienna Lager",
        style: "Vienna Lager",
        batchSize: "500",
        targetAbv: "5.2",
        targetIbu: 25,
        ingredients: JSON.parse('["Vienna Malt", "Munich Malt", "Saaz Hops", "Lager Yeast"]'),
        instructions: "Mash at 154°F for 60 minutes, Boil for 90 minutes, Ferment at 50°F for 14 days, Lager for 4 weeks",
        fermentationTemp: "50°F",
        fermentationTime: "14 days",
        notes: "Traditional amber lager with toasty malt character",
        imageUrl: null
      }
    ];
    
    sampleRecipes.forEach(recipe => this.createRecipe(recipe));
    
    // Create sample brewing schedules
    const sampleSchedules: InsertBrewingSchedule[] = [
      {
        title: "Summer Kolsch Batch #1242",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-25"),
        status: "in-progress",
        batchSize: "500L",
        description: "First batch of Summer Kolsch for the season",
        notes: "Targeting lower fermentation temperature",
        recipeId: 1,
        equipmentId: 1
      },
      {
        title: "Vienna Lager Batch #1243",
        startDate: new Date("2024-03-20"),
        endDate: new Date("2024-04-20"),
        status: "scheduled",
        batchSize: "500L",
        description: "Monthly Vienna Lager batch",
        notes: "Extended lagering period",
        recipeId: 2,
        equipmentId: 2
      }
    ];
    
    sampleSchedules.forEach(schedule => this.createBrewingSchedule(schedule));
  }
}