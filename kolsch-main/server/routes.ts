import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { 
  insertInventoryItemSchema, 
  insertEquipmentSchema, 
  insertRecipeSchema, 
  insertBrewingScheduleSchema,
  insertIngredientSourceSchema,
  insertIngredientPriceHistorySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Setup session middleware with PostgreSQL store
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: 'sessions'
    }),
    secret: process.env.SESSION_SECRET || 'kolsch-brewery-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Authentication status endpoint
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    const session = req.session as any;
    console.log("Auth check - Session data:", session);
    console.log("Auth check - User ID:", session?.userId);
    
    if (session.userId) {
      try {
        const user = await storage.getUser(session.userId);
        console.log("Auth check - Found user:", user ? "Yes" : "No");
        if (user) {
          const brewery = await storage.getBrewery(user.breweryId!);
          const responseData = {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              breweryId: user.breweryId
            },
            brewery
          };
          console.log("Auth check - Sending response:", responseData);
          res.json(responseData);
          return;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    console.log("Auth check - No valid session, returning null");
    res.json(null);
  });
  
  // Signup route for new brewery accounts
  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      const { user, brewery } = req.body;
      
      console.log("Signup attempt - Request body:", { 
        user: { ...user, password: '[REDACTED]' }, 
        brewery 
      });

      // Validate required user fields
      if (!user.firstName || !user.lastName || !user.email || !user.username || !user.password) {
        console.log("Signup validation failed - Missing user fields");
        return res.status(400).json({ message: "All user fields are required" });
      }

      // Validate required brewery fields
      if (!brewery.name || !brewery.type || !brewery.location) {
        console.log("Signup validation failed - Missing brewery fields");
        return res.status(400).json({ message: "Brewery name, type, and location are required" });
      }

      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(user.username);
      if (existingUsername) {
        console.log("Signup failed - Username already exists:", user.username);
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(user.email);
      if (existingEmail) {
        console.log("Signup failed - Email already exists:", user.email);
        return res.status(400).json({ message: "Email already exists" });
      }

      // Generate unique brewery GUID
      const breweryId = randomUUID();
      const userId = randomUUID();

      console.log("Creating new brewery and user with IDs:", { breweryId, userId });

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create brewery account first
      const newBrewery = await storage.createBrewery({
        id: breweryId,
        name: brewery.name,
        type: brewery.type,
        location: brewery.location,
        foundedYear: brewery.foundedYear || null,
        website: brewery.website || null,
        phone: brewery.phone || null,
        brewingCapacity: brewery.brewingCapacity || null,
        specialties: brewery.specialties || null,
      });

      console.log("Created brewery:", newBrewery);

      // Create user account linked to brewery
      const newUser = await storage.createUser({
        id: userId,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        breweryId: breweryId,
        role: user.role || 'owner',
      });

      console.log("Created user:", { ...newUser, password: '[REDACTED]' });

      // Brewery account created successfully - now log them in automatically
      const session = req.session as any;
      session.userId = newUser.id;
      session.breweryId = newBrewery.id;

      console.log("Session created:", { userId: session.userId, breweryId: session.breweryId });

      res.json({ 
        message: "Account created successfully",
        brewery: newBrewery,
        user: { ...newUser, password: undefined }
      });
    } catch (error: any) {
      console.error("Signup error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail
      });
      
      if (error.message.includes("unique") || error.message.includes("duplicate")) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      
      // Send back more detailed error message in development
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? `Failed to create account: ${error.message}`
        : "Failed to create account";
        
      res.status(500).json({ message: errorMessage });
    }
  });

  // Login route for existing users
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Create session
      const session = req.session as any;
      session.userId = user.id;
      session.breweryId = user.breweryId;
      
      console.log("Login - Setting session userId:", user.id);
      console.log("Login - Setting session breweryId:", user.breweryId);
      
      // Force session save
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            reject(err);
          } else {
            console.log("Session saved successfully");
            resolve(true);
          }
        });
      });

      // Get brewery information
      const brewery = await storage.getBrewery(user.breweryId!);

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          breweryId: user.breweryId
        },
        brewery
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout endpoint (POST)
  app.post("/api/logout", async (req: Request, res: Response) => {
    const session = req.session as any;
    session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Manual logout endpoint (GET) - for when users get stuck
  app.get("/api/logout", async (req: Request, res: Response) => {
    const session = req.session as any;
    session.destroy((err: any) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.clearCookie('connect.sid');
      res.redirect("/");
    });
  });

  // Force clear session endpoint
  app.get("/api/clear-session", async (req: Request, res: Response) => {
    try {
      // Clear all possible session identifiers
      res.clearCookie('connect.sid');
      res.clearCookie('session');
      res.clearCookie('sessionId');
      
      // Destroy session if it exists
      if (req.session) {
        const session = req.session as any;
        session.destroy(() => {});
      }
      
      // Send response that forces client-side redirect
      res.send(`
        <html>
          <body>
            <script>
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/';
            </script>
            <p>Clearing session... <a href="/">Click here if not redirected</a></p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Clear session error:", error);
      res.redirect("/");
    }
  });
  
  // Inventory routes
  app.get("/api/inventory", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });
  
  app.get("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const item = await storage.getInventoryItem(id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });
  
  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      console.log('\nReceived inventory item data:');
      console.log(JSON.stringify(req.body, null, 2));
      
      const validatedData = insertInventoryItemSchema.parse(req.body);
      console.log('\nValidated data:');
      console.log(JSON.stringify(validatedData, null, 2));
      
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('\nValidation error details:');
        console.error('Errors:', JSON.stringify(error.errors, null, 2));
        console.error('Received data:', JSON.stringify(req.body, null, 2));
        
        return res.status(400).json({ 
          message: "Invalid inventory item data", 
          errors: error.errors,
          received: req.body 
        });
      }
      console.error('\nError creating inventory item:', error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });
  
  app.put("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });
  
  app.delete("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteInventoryItem(id);
      if (!success) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });
  
  // Equipment routes
  app.get("/api/equipment", async (_req: Request, res: Response) => {
    try {
      const equipmentItems = await storage.getAllEquipment();
      res.json(equipmentItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment items" });
    }
  });
  
  app.get("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const equipment = await storage.getEquipment(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });
  
  app.post("/api/equipment", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEquipmentSchema.parse(req.body);
      const newEquipment = await storage.createEquipment(validatedData);
      res.status(201).json(newEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });
  
  app.put("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertEquipmentSchema.partial().parse(req.body);
      const updatedEquipment = await storage.updateEquipment(id, validatedData);
      
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });
  
  app.delete("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteEquipment(id);
      if (!success) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete equipment" });
    }
  });
  
  // Recipe routes
  app.get("/api/recipes", async (_req: Request, res: Response) => {
    try {
      console.log("=== FETCHING RECIPES ===");
      const recipes = await storage.getAllRecipes();
      console.log("Recipes fetched successfully:", recipes.length, "recipes");
      res.json(recipes);
    } catch (error) {
      console.error("=== FETCH RECIPES ERROR ===");
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  
  app.get("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  
  app.post("/api/recipes", async (req: Request, res: Response) => {
    try {
      console.log("=== RECIPE CREATION DEBUG ===");
      console.log("1. Request body:", JSON.stringify(req.body, null, 2));
      
      const session = req.session as any;
      console.log("2. Session data:", { 
        userId: session?.userId, 
        breweryId: session?.breweryId,
        hasSession: !!session 
      });
      
      if (!session.breweryId) {
        console.log("3. ERROR: No breweryId in session");
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Add breweryId to the request body
      const recipeData = {
        ...req.body,
        breweryId: session.breweryId
      };
      
      console.log("4. Recipe data with breweryId:", JSON.stringify(recipeData, null, 2));
      
      console.log("5. About to validate with schema...");
      const validatedData = insertRecipeSchema.parse(recipeData);
      console.log("6. Validation successful:", JSON.stringify(validatedData, null, 2));
      
      console.log("7. About to call storage.createRecipe...");
      const newRecipe = await storage.createRecipe(validatedData);
      console.log("8. Recipe created successfully:", JSON.stringify(newRecipe, null, 2));
      
      res.status(201).json(newRecipe);
    } catch (error) {
      console.error("=== RECIPE CREATION ERROR ===");
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      if (error instanceof z.ZodError) {
        console.error("Zod validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  
  app.put("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Transform numeric fields to strings for database compatibility
      // const transformedData = {
      //   ...req.body,
      //   targetAbv: req.body.targetAbv?.toString(),
      //   targetIbu: req.body.targetIbu?.toString(),
      //   srm: req.body.srm?.toString(),
      // };
      
      const validatedData = insertRecipeSchema.partial().parse(req.body);
      const updatedRecipe = await storage.updateRecipe(id, validatedData);
      
      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(updatedRecipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  
  app.delete("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteRecipe(id);
      if (!success) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });
  
  // Brewing schedule routes
  app.get("/api/schedules", async (_req: Request, res: Response) => {
    try {
      const schedules = await storage.getAllBrewingSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brewing schedules" });
    }
  });
  
  app.get("/api/schedules/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const schedule = await storage.getBrewingSchedule(id);
      if (!schedule) {
        return res.status(404).json({ message: "Brewing schedule not found" });
      }
      
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brewing schedule" });
    }
  });
  
  app.post("/api/schedules", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBrewingScheduleSchema.parse(req.body);
      const newSchedule = await storage.createBrewingSchedule(validatedData);
      res.status(201).json(newSchedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brewing schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brewing schedule" });
    }
  });
  
  app.put("/api/schedules/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertBrewingScheduleSchema.partial().parse(req.body);
      const updatedSchedule = await storage.updateBrewingSchedule(id, validatedData);
      
      if (!updatedSchedule) {
        return res.status(404).json({ message: "Brewing schedule not found" });
      }
      
      res.json(updatedSchedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brewing schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update brewing schedule" });
    }
  });
  
  app.delete("/api/schedules/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteBrewingSchedule(id);
      if (!success) {
        return res.status(404).json({ message: "Brewing schedule not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brewing schedule" });
    }
  });
  
  // Ingredient sources routes
  app.get("/api/ingredient-sources", async (_req: Request, res: Response) => {
    try {
      const sources = await storage.getAllIngredientSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredient sources" });
    }
  });
  
  app.get("/api/ingredient-sources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const source = await storage.getIngredientSource(id);
      if (!source) {
        return res.status(404).json({ message: "Ingredient source not found" });
      }
      
      res.json(source);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredient source" });
    }
  });
  
  app.post("/api/ingredient-sources", async (req: Request, res: Response) => {
    try {
      const validatedData = insertIngredientSourceSchema.parse(req.body);
      const newSource = await storage.createIngredientSource(validatedData);
      res.status(201).json(newSource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient source data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ingredient source" });
    }
  });
  
  app.put("/api/ingredient-sources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertIngredientSourceSchema.partial().parse(req.body);
      const updatedSource = await storage.updateIngredientSource(id, validatedData);
      
      if (!updatedSource) {
        return res.status(404).json({ message: "Ingredient source not found" });
      }
      
      res.json(updatedSource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient source data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update ingredient source" });
    }
  });
  
  app.delete("/api/ingredient-sources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteIngredientSource(id);
      if (!success) {
        return res.status(404).json({ message: "Ingredient source not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ingredient source" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const inventoryItems = await storage.getInventoryItems();
      const equipmentItems = await storage.getAllEquipment();
      const schedules = await storage.getAllBrewingSchedules();
      
      // Calculate the stats
      const batchesInProcess = schedules.filter(s => s.status === "in_progress").length;
      const totalInventoryItems = inventoryItems.length;
      const lowStockItems = inventoryItems.filter(item => 
        item.quantity < 10 // Simple low stock threshold
      ).length;
      
      const totalEquipment = equipmentItems.length;
      const activeEquipment = equipmentItems.filter(e => e.status === "active").length;
      const equipmentUtilization = totalEquipment > 0 ? Math.floor((activeEquipment / totalEquipment) * 100) : 0;
      const maintenanceNeeded = equipmentItems.filter(e => 
        e.nextMaintenance && new Date(e.nextMaintenance) <= new Date()
      ).length;
      
      const scheduledBrews = schedules.filter(s => s.status === "scheduled").length;
      const thisWeekBrews = schedules.filter(s => {
        const scheduleDate = new Date(s.startDate);
        const today = new Date();
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        
        return scheduleDate >= today && scheduleDate <= endOfWeek;
      }).length;
      
      res.json({
        batchesInProcess,
        batchesInProcessChange: "+3",
        totalInventoryItems,
        lowStockItems,
        equipmentUtilization,
        maintenanceNeeded,
        scheduledBrews,
        thisWeekBrews
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Ingredient price history routes
  app.get("/api/price-history", async (_req: Request, res: Response) => {
    try {
      const history = await storage.getAllPriceHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });
  
  app.get("/api/price-history/ingredient/:id", async (req: Request, res: Response) => {
    try {
      const ingredientId = parseInt(req.params.id);
      if (isNaN(ingredientId)) {
        return res.status(400).json({ message: "Invalid ingredient ID format" });
      }
      
      const history = await storage.getPriceHistoryForIngredient(ingredientId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price history for ingredient" });
    }
  });
  
  app.post("/api/price-history", async (req: Request, res: Response) => {
    try {
      const validatedData = insertIngredientPriceHistorySchema.parse(req.body);
      const newEntry = await storage.addPriceHistoryEntry(validatedData);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create price history entry" });
    }
  });
  
  app.put("/api/price-history/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertIngredientPriceHistorySchema.partial().parse(req.body);
      const updatedEntry = await storage.updatePriceHistoryEntry(id, validatedData);
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "Price history entry not found" });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update price history entry" });
    }
  });
  
  app.delete("/api/price-history/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deletePriceHistoryEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Price history entry not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete price history entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
