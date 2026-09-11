import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDomainColumn() {
  console.log('🔧 Fixing domain column type...\n');
  
  try {
    // Drop the default first
    console.log('[1/4] Dropping default...');
    await prisma.$executeRaw`
      ALTER TABLE "Field" ALTER COLUMN "domain" DROP DEFAULT
    `;
    console.log('✅ Default dropped\n');
    
    // Make nullable temporarily
    console.log('[2/4] Making column nullable...');
    await prisma.$executeRaw`
      ALTER TABLE "Field" ALTER COLUMN "domain" DROP NOT NULL
    `;
    console.log('✅ Column is now nullable\n');
    
    // Change type to enum
    console.log('[3/4] Converting to enum type...');
    await prisma.$executeRaw`
      ALTER TABLE "Field" 
      ALTER COLUMN "domain" TYPE "Domain" 
      USING CASE 
        WHEN "domain" = 'TECHNOLOGY' THEN 'TECHNOLOGY'::"Domain"
        WHEN "domain" = 'AYUSH' THEN 'AYUSH'::"Domain"
        ELSE 'TECHNOLOGY'::"Domain"
      END
    `;
    console.log('✅ Type converted to enum\n');
    
    // Set default and make NOT NULL
    console.log('[4/4] Setting default and making NOT NULL...');
    await prisma.$executeRaw`
      ALTER TABLE "Field" 
      ALTER COLUMN "domain" SET DEFAULT 'TECHNOLOGY'::"Domain"
    `;
    await prisma.$executeRaw`
      ALTER TABLE "Field" ALTER COLUMN "domain" SET NOT NULL
    `;
    console.log('✅ Constraints applied\n');
    
    // Verify
    console.log('🔍 Verifying...');
    const fields = await prisma.$queryRaw`
      SELECT "id", "name", "domain" FROM "Field" LIMIT 5
    ` as any[];
    
    console.log('Sample fields:');
    fields.forEach((f: any) => {
      console.log(`   - ${f.name}: ${f.domain}`);
    });
    
    console.log('\n✅ Domain column fixed successfully!\n');
    
  } catch (error: any) {
    console.error('\n❌ Fix failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixDomainColumn();
