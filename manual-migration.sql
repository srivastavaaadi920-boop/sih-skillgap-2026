-- Manual migration to add domain field and FieldSkill table
-- This migration adds AYUSH support to the existing database

-- Step 1: Add domain column to Field table with a default
ALTER TABLE "Field" ADD COLUMN IF NOT EXISTS "domain" TEXT NOT NULL DEFAULT 'TECHNOLOGY';

-- Step 2: Create the Domain enum if it doesn't exist
-- (Note: This is handled by Prisma, but if needed manually:)
DO $$ BEGIN
    CREATE TYPE "Domain" AS ENUM ('TECHNOLOGY', 'AYUSH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Alter the column type to use the enum
ALTER TABLE "Field" ALTER COLUMN "domain" TYPE "Domain" USING "domain"::"Domain";

-- Step 4: Remove the default after setting all existing records
ALTER TABLE "Field" ALTER COLUMN "domain" DROP DEFAULT;

-- Step 5: Add isCustom field to Skill table (if not exists)
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "isCustom" BOOLEAN NOT NULL DEFAULT false;

-- Step 6: Create FieldSkill join table
CREATE TABLE IF NOT EXISTS "FieldSkill" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldSkill_pkey" PRIMARY KEY ("id")
);

-- Step 7: Create unique constraint on FieldSkill
CREATE UNIQUE INDEX IF NOT EXISTS "FieldSkill_fieldId_skillId_key" ON "FieldSkill"("fieldId", "skillId");

-- Step 8: Create indexes on FieldSkill
CREATE INDEX IF NOT EXISTS "FieldSkill_fieldId_idx" ON "FieldSkill"("fieldId");
CREATE INDEX IF NOT EXISTS "FieldSkill_skillId_idx" ON "FieldSkill"("skillId");

-- Step 9: Add foreign key constraints
ALTER TABLE "FieldSkill" DROP CONSTRAINT IF EXISTS "FieldSkill_fieldId_fkey";
ALTER TABLE "FieldSkill" ADD CONSTRAINT "FieldSkill_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FieldSkill" DROP CONSTRAINT IF EXISTS "FieldSkill_skillId_fkey";
ALTER TABLE "FieldSkill" ADD CONSTRAINT "FieldSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 10: Add isCustom index to Skill
CREATE INDEX IF NOT EXISTS "Skill_isCustom_idx" ON "Skill"("isCustom");

-- Step 11: Set all existing fields to TECHNOLOGY domain (already done with DEFAULT, but just to be safe)
UPDATE "Field" SET "domain" = 'TECHNOLOGY' WHERE "domain" IS NULL;

COMMIT;
