import { pgTable, foreignKey, serial, varchar, numeric, integer, jsonb, text, timestamp, unique, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const recipes = pgTable("recipes", {
	id: serial().primaryKey().notNull(),
	breweryId: varchar("brewery_id"),
	name: varchar().notNull(),
	style: varchar(),
	batchSize: numeric("batch_size", { precision: 10, scale:  2 }),
	targetAbv: numeric("target_abv", { precision: 4, scale:  2 }),
	targetIbu: integer("target_ibu"),
	ingredients: jsonb().notNull(),
	instructions: text().notNull(),
	fermentationTemp: varchar("fermentation_temp"),
	fermentationTime: varchar("fermentation_time"),
	description: text(),
	imageUrl: varchar("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "recipes_brewery_id_breweries_id_fk"
		}),
]);

export const equipment = pgTable("equipment", {
	id: serial().primaryKey().notNull(),
	breweryId: varchar("brewery_id"),
	name: varchar().notNull(),
	type: varchar().notNull(),
	capacity: varchar(),
	status: varchar().default('available').notNull(),
	location: varchar(),
	purchaseDate: timestamp("purchase_date", { mode: 'string' }),
	lastMaintenance: timestamp("last_maintenance", { mode: 'string' }),
	nextMaintenance: timestamp("next_maintenance", { mode: 'string' }),
	notes: text(),
	imageUrl: varchar("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "equipment_brewery_id_breweries_id_fk"
		}),
]);

export const ingredientPriceHistory = pgTable("ingredient_price_history", {
	id: serial().primaryKey().notNull(),
	breweryId: varchar("brewery_id"),
	ingredientId: integer("ingredient_id"),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	supplier: varchar(),
	date: timestamp({ mode: 'string' }).notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "ingredient_price_history_brewery_id_breweries_id_fk"
		}),
	foreignKey({
			columns: [table.ingredientId],
			foreignColumns: [inventoryItems.id],
			name: "ingredient_price_history_ingredient_id_inventory_items_id_fk"
		}),
]);

export const inventoryItems = pgTable("inventory_items", {
	id: serial().primaryKey().notNull(),
	breweryId: varchar("brewery_id"),
	name: varchar().notNull(),
	quantity: integer().notNull(),
	unit: varchar().notNull(),
	location: varchar(),
	expirationDate: timestamp("expiration_date", { mode: 'string' }),
	cost: numeric({ precision: 10, scale:  2 }),
	supplier: varchar(),
	barcode: varchar(),
	category: varchar(),
	notes: text(),
	imageUrl: varchar("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "inventory_items_brewery_id_breweries_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	username: varchar().notNull(),
	email: varchar().notNull(),
	password: varchar().notNull(),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	breweryId: varchar("brewery_id"),
	role: varchar().default('member').notNull(),
	profileImageUrl: varchar("profile_image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "users_brewery_id_breweries_id_fk"
		}),
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const ingredientSources = pgTable("ingredient_sources", {
	id: serial().primaryKey().notNull(),
	breweryId: varchar("brewery_id"),
	name: varchar().notNull(),
	type: varchar().notNull(),
	supplier: varchar().notNull(),
	location: varchar().notNull(),
	contact: varchar(),
	rating: integer(),
	notes: text(),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "ingredient_sources_brewery_id_breweries_id_fk"
		}),
]);

export const sessions = pgTable("sessions", {
	sid: varchar().primaryKey().notNull(),
	sess: jsonb().notNull(),
	expire: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("IDX_session_expire").using("btree", table.expire.asc().nullsLast().op("timestamp_ops")),
]);

export const breweries = pgTable("breweries", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	type: varchar().notNull(),
	location: varchar().notNull(),
	foundedYear: integer("founded_year"),
	website: varchar(),
	phone: varchar(),
	brewingCapacity: varchar("brewing_capacity"),
	specialties: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const brewingSchedules = pgTable("brewing_schedules", {
	id: serial().primaryKey().notNull(),
	breweryId: varchar("brewery_id"),
	title: varchar().notNull(),
	description: text(),
	recipeId: integer("recipe_id"),
	equipmentId: integer("equipment_id"),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	status: varchar().default('scheduled').notNull(),
	batchSize: numeric("batch_size", { precision: 10, scale:  2 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.breweryId],
			foreignColumns: [breweries.id],
			name: "brewing_schedules_brewery_id_breweries_id_fk"
		}),
	foreignKey({
			columns: [table.recipeId],
			foreignColumns: [recipes.id],
			name: "brewing_schedules_recipe_id_recipes_id_fk"
		}),
	foreignKey({
			columns: [table.equipmentId],
			foreignColumns: [equipment.id],
			name: "brewing_schedules_equipment_id_equipment_id_fk"
		}),
]);
