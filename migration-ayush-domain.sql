-- Migration: Add AYUSH Domain and FieldSkill mapping
-- Run this when database is accessible

-- 1. Create Domain enum
CREATE TYPE "Domain" AS ENUM ('TECHNOLOGY', 'AYUSH');

-- 2. Add domain column to Field table with default TECHNOLOGY for existing rows
ALTER TABLE "Field" ADD COLUMN "domain" "Domain" NOT NULL DEFAULT 'TECHNOLOGY';

-- 3. Add selectedDomain and hasCompletedOnboarding to StudentProfile
ALTER TABLE "StudentProfile" ADD COLUMN "selectedDomain" "Domain";
ALTER TABLE "StudentProfile" ADD COLUMN "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- 4. Create FieldSkill join table
CREATE TABLE "FieldSkill" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldSkill_pkey" PRIMARY KEY ("id")
);

-- 5. Add unique constraint and indexes to FieldSkill
CREATE UNIQUE INDEX "FieldSkill_fieldId_skillId_key" ON "FieldSkill"("fieldId", "skillId");
CREATE INDEX "FieldSkill_fieldId_idx" ON "FieldSkill"("fieldId");
CREATE INDEX "FieldSkill_skillId_idx" ON "FieldSkill"("skillId");

-- 6. Add foreign key constraints
ALTER TABLE "FieldSkill" ADD CONSTRAINT "FieldSkill_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FieldSkill" ADD CONSTRAINT "FieldSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7. Add index on Field.domain
CREATE INDEX "Field_domain_idx" ON "Field"("domain");

-- 8. Add unique constraint on Goal (fieldId, title)
CREATE UNIQUE INDEX "Goal_fieldId_title_key" ON "Goal"("fieldId", "title");

-- Verification queries
SELECT 'Migration complete!' as status;
SELECT COUNT(*) as field_count FROM "Field";
SELECT COUNT(*) as skill_count FROM "Skill";
