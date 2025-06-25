import { relations } from "drizzle-orm/relations";
import { breweries, recipes, equipment, ingredientPriceHistory, inventoryItems, users, ingredientSources, brewingSchedules } from "./schema";

export const recipesRelations = relations(recipes, ({one, many}) => ({
	brewery: one(breweries, {
		fields: [recipes.breweryId],
		references: [breweries.id]
	}),
	brewingSchedules: many(brewingSchedules),
}));

export const breweriesRelations = relations(breweries, ({many}) => ({
	recipes: many(recipes),
	equipment: many(equipment),
	ingredientPriceHistories: many(ingredientPriceHistory),
	inventoryItems: many(inventoryItems),
	users: many(users),
	ingredientSources: many(ingredientSources),
	brewingSchedules: many(brewingSchedules),
}));

export const equipmentRelations = relations(equipment, ({one, many}) => ({
	brewery: one(breweries, {
		fields: [equipment.breweryId],
		references: [breweries.id]
	}),
	brewingSchedules: many(brewingSchedules),
}));

export const ingredientPriceHistoryRelations = relations(ingredientPriceHistory, ({one}) => ({
	brewery: one(breweries, {
		fields: [ingredientPriceHistory.breweryId],
		references: [breweries.id]
	}),
	inventoryItem: one(inventoryItems, {
		fields: [ingredientPriceHistory.ingredientId],
		references: [inventoryItems.id]
	}),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({one, many}) => ({
	ingredientPriceHistories: many(ingredientPriceHistory),
	brewery: one(breweries, {
		fields: [inventoryItems.breweryId],
		references: [breweries.id]
	}),
}));

export const usersRelations = relations(users, ({one}) => ({
	brewery: one(breweries, {
		fields: [users.breweryId],
		references: [breweries.id]
	}),
}));

export const ingredientSourcesRelations = relations(ingredientSources, ({one}) => ({
	brewery: one(breweries, {
		fields: [ingredientSources.breweryId],
		references: [breweries.id]
	}),
}));

export const brewingSchedulesRelations = relations(brewingSchedules, ({one}) => ({
	brewery: one(breweries, {
		fields: [brewingSchedules.breweryId],
		references: [breweries.id]
	}),
	recipe: one(recipes, {
		fields: [brewingSchedules.recipeId],
		references: [recipes.id]
	}),
	equipment: one(equipment, {
		fields: [brewingSchedules.equipmentId],
		references: [equipment.id]
	}),
}));