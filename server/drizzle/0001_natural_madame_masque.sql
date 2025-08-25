ALTER TYPE "repeat_type" ADD VALUE 'monthly';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "is_recurring" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "is_template" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "template_id" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "frequency" "repeat_type" DEFAULT 'daily';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_template_id_tasks_id_fk" FOREIGN KEY ("template_id") REFERENCES "tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
