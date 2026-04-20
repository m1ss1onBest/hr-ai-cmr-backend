-- Add User.name column
ALTER TABLE "User" ADD COLUMN "name" VARCHAR(255);

-- Backfill for existing rows (if any)
UPDATE "User" SET "name" = '' WHERE "name" IS NULL;

-- Enforce NOT NULL
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

