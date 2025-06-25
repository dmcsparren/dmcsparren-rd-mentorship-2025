DROP INDEX "IDX_session_expire";--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "instructions" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "srm" integer;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD COLUMN "current_quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD COLUMN "minimum_quantity" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD COLUMN "status" varchar DEFAULT 'good';--> statement-breakpoint
ALTER TABLE "inventory_items" ADD COLUMN "forecast" varchar DEFAULT 'Sufficient';--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");