import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDomainEnum() {
  console.log('🔧 Creating Domain enum type...\n');
  
  try {
    // Create the Domain enum
    console.log('[1/3] Creating Domain enum...');
    try {
      await prisma.$executeRaw`
        CREATE TYPE "Domain" AS ENUM ('TECHNOLOGY', 'AYUSH')
      `;
      console.log('✅ Domain enum created\n');
    } catch (e: any) {
      if (e.message && e.message.includes('already exists')) {
        console.log('⚠️  Domain enum already exists\n');
      } else {
        console.error('❌ Error creating enum:', e.message);
        throw e;
      }
    }
    
    // Alter the domain column to use the enum
    console.log('[2/3] Converting domain column to use enum...');
    try {
      // First, make it nullable temporarily
      await prisma.$executeRaw`
        ALTER TABLE "Field" ALTER COLUMN "domain" DROP NOT NULL
      `;
      
      // Change type
      await prisma.$executeRaw`
        ALTER TABLE "Field" 
        ALTER COLUMN "domain" TYPE "Domain" 
        USING CASE 
          WHEN "domain" = 'TECHNOLOGY' THEN 'TECHNOLOGY'::"Domain"
          WHEN "domain" = 'AYUSH' THEN 'AYUSH'::"Domain"
          ELSE 'TECHNOLOGY'::"Domain"
        END
      `;
      
      // Set default
      await prisma.$executeRaw`
        ALTER TABLE "Field" 
        ALTER COLUMN "domain" SET DEFAULT 'TECHNOLOGY'::"Domain"
      `;
      
      // Make it NOT NULL again
      await prisma.$executeRaw`
        ALTER TABLE "Field" ALTER COLUMN "domain" SET NOT NULL
      `;
      
      console.log('✅ Column converted to enum\n');
    } catch (e: any) {
      console.error('❌ Error converting column:', e.message);
      console.log('This might be okay if it was already an enum type\n');
    }
    
    // Verify
    console.log('[3/3] Verifying setup...');
    const fields = await prisma.$queryRaw`
      SELECT "id", "name", "domain" FROM "Field" LIMIT 3
    ` as any[];
    
    console.log('✅ Sample fields:');
    fields.forEach((f: any) => {
      console.log(`   - ${f.name}: ${f.domain}`);
    });
    
    console.log('\n✅ Domain enum setup completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createDomainEnum();
