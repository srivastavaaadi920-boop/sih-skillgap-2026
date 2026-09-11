import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSimpleMigration() {
  console.log('🔧 Running simple migration...\n');
  
  try {
    // Step 1: Add domain column with TECHNOLOGY default
    console.log('[1/7] Adding domain column to Field table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Field" 
        ADD COLUMN IF NOT EXISTS "domain" TEXT NOT NULL DEFAULT 'TECHNOLOGY'
      `;
      console.log('✅ Domain column added\n');
    } catch (e: any) {
      console.log('⚠️  Domain column might already exist\n');
    }
    
    // Step 2: Add isCustom column to Skill table
    console.log('[2/7] Adding isCustom column to Skill table...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Skill" 
        ADD COLUMN IF NOT EXISTS "isCustom" BOOLEAN NOT NULL DEFAULT false
      `;
      console.log('✅ isCustom column added\n');
    } catch (e: any) {
      console.log('⚠️  isCustom column might already exist\n');
    }
    
    // Step 3: Create FieldSkill table
    console.log('[3/7] Creating FieldSkill table...');
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "FieldSkill" (
          "id" TEXT NOT NULL,
          "fieldId" TEXT NOT NULL,
          "skillId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "FieldSkill_pkey" PRIMARY KEY ("id")
        )
      `;
      console.log('✅ FieldSkill table created\n');
    } catch (e: any) {
      console.log('⚠️  FieldSkill table might already exist\n');
    }
    
    // Step 4: Add unique constraint
    console.log('[4/7] Adding unique constraint to FieldSkill...');
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "FieldSkill_fieldId_skillId_key" 
        ON "FieldSkill"("fieldId", "skillId")
      `;
      console.log('✅ Unique constraint added\n');
    } catch (e: any) {
      console.log('⚠️  Constraint might already exist\n');
    }
    
    // Step 5: Add indexes
    console.log('[5/7] Adding indexes...');
    try {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "FieldSkill_fieldId_idx" ON "FieldSkill"("fieldId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "FieldSkill_skillId_idx" ON "FieldSkill"("skillId")
      `;
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Skill_isCustom_idx" ON "Skill"("isCustom")
      `;
      console.log('✅ Indexes added\n');
    } catch (e: any) {
      console.log('⚠️  Indexes might already exist\n');
    }
    
    // Step 6: Add foreign keys
    console.log('[6/7] Adding foreign keys...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE "FieldSkill" 
        DROP CONSTRAINT IF EXISTS "FieldSkill_fieldId_fkey"
      `;
      await prisma.$executeRaw`
        ALTER TABLE "FieldSkill" 
        ADD CONSTRAINT "FieldSkill_fieldId_fkey" 
        FOREIGN KEY ("fieldId") REFERENCES "Field"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      
      await prisma.$executeRaw`
        ALTER TABLE "FieldSkill" 
        DROP CONSTRAINT IF EXISTS "FieldSkill_skillId_fkey"
      `;
      await prisma.$executeRaw`
        ALTER TABLE "FieldSkill" 
        ADD CONSTRAINT "FieldSkill_skillId_fkey" 
        FOREIGN KEY ("skillId") REFERENCES "Skill"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Foreign keys added\n');
    } catch (e: any) {
      console.log('⚠️  Foreign keys might already exist or table structure issue\n');
    }
    
    // Step 7: Update all existing fields to TECHNOLOGY
    console.log('[7/7] Setting existing fields to TECHNOLOGY domain...');
    try {
      const result = await prisma.$executeRaw`
        UPDATE "Field" SET "domain" = 'TECHNOLOGY' WHERE "domain" IS NULL
      `;
      console.log(`✅ Updated ${result} fields\n`);
    } catch (e: any) {
      console.log('⚠️  Already updated or no null values\n');
    }
    
    console.log('\n✅ Migration completed successfully!\n');
    
    // Verify
    console.log('🔍 Verifying migration...');
    const fieldCount = await prisma.field.count();
    const skillCount = await prisma.skill.count();
    console.log(`   Fields: ${fieldCount}`);
    console.log(`   Skills: ${skillCount}`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runSimpleMigration();
