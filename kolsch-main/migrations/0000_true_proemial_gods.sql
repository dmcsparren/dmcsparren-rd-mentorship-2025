-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"brewery_id" varchar,
	"name" varchar NOT NULL,
	"style" varchar,
	"batch_size" numeric(10, 2),
	"target_abv" numeric(4, 2),
	"target_ibu" integer,
	"ingredients" jsonb NOT NULL,
	"instructions" text NOT NULL,
	"fermentation_temp" varchar,
	"fermentation_time" varchar,
	"description" text,
	"image_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"brewery_id" varchar,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"capacity" varchar,
	"status" varchar DEFAULT 'available' NOT NULL,
	"location" varchar,
	"purchase_date" timestamp,
	"last_maintenance" timestamp,
	"next_maintenance" timestamp,
	"notes" text,
	"image_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredient_price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"brewery_id" varchar,
	"ingredient_id" integer,
	"price" numeric(10, 2) NOT NULL,
	"supplier" varchar,
	"date" timestamp NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"brewery_id" varchar,
	"name" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"unit" varchar NOT NULL,
	"location" varchar,
	"expiration_date" timestamp,
	"cost" numeric(10, 2),
	"supplier" varchar,
	"barcode" varchar,
	"category" varchar,
	"notes" text,
	"image_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"brewery_id" varchar,
	"role" varchar DEFAULT 'member' NOT NULL,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "ingredient_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"brewery_id" varchar,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"supplier" varchar NOT NULL,
	"location" varchar NOT NULL,
	"contact" varchar,
	"rating" integer,
	"notes" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "breweries" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"location" varchar NOT NULL,
	"founded_year" integer,
	"website" varchar,
	"phone" varchar,
	"brewing_capacity" varchar,
	"specialties" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brewing_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"brewery_id" varchar,
	"title" varchar NOT NULL,
	"description" text,
	"recipe_id" integer,
	"equipment_id" integer,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"batch_size" numeric(10, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_price_history" ADD CONSTRAINT "ingredient_price_history_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_price_history" ADD CONSTRAINT "ingredient_price_history_ingredient_id_inventory_items_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient_sources" ADD CONSTRAINT "ingredient_sources_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brewing_schedules" ADD CONSTRAINT "brewing_schedules_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brewing_schedules" ADD CONSTRAINT "brewing_schedules_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brewing_schedules" ADD CONSTRAINT "brewing_schedules_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire" timestamp_ops);
*/