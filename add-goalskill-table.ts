import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addGoalSkillTable() {
  console.log('🔧 Adding GoalSkill table...\n');
  
  try {
    // Create GoalSkill table
    console.log('[1/3] Creating GoalSkill table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "GoalSkill" (
        "id" TEXT NOT NULL,
        "goalId" TEXT NOT NULL,
        "skillId" TEXT NOT NULL,
        "requiredLevel" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GoalSkill_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log('✅ GoalSkill table created\n');
    
    // Add unique constraint
    console.log('[2/3] Adding unique constraint...');
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "GoalSkill_goalId_skillId_key" 
      ON "GoalSkill"("goalId", "skillId")
    `;
    console.log('✅ Unique constraint added\n');
    
    // Add indexes and foreign keys
    console.log('[3/3] Adding indexes and foreign keys...');
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "GoalSkill_goalId_idx" ON "GoalSkill"("goalId")
    `;
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "GoalSkill_skillId_idx" ON "GoalSkill"("skillId")
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "GoalSkill" 
      DROP CONSTRAINT IF EXISTS "GoalSkill_goalId_fkey"
    `;
    await prisma.$executeRaw`
      ALTER TABLE "GoalSkill" 
      ADD CONSTRAINT "GoalSkill_goalId_fkey" 
      FOREIGN KEY ("goalId") REFERENCES "Goal"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "GoalSkill" 
      DROP CONSTRAINT IF EXISTS "GoalSkill_skillId_fkey"
    `;
    await prisma.$executeRaw`
      ALTER TABLE "GoalSkill" 
      ADD CONSTRAINT "GoalSkill_skillId_fkey" 
      FOREIGN KEY ("skillId") REFERENCES "Skill"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `;
    console.log('✅ Indexes and foreign keys added\n');
    
    console.log('✅ GoalSkill table setup complete!\n');
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addGoalSkillTable();
