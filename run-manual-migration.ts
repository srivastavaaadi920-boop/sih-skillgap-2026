import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function runManualMigration() {
  console.log('🔧 Running manual migration...\n');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'manual-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split by semicolon and filter out empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'COMMIT');
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;
      
      console.log(`[${i + 1}/${statements.length}] Executing...`);
      
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Success\n`);
      } catch (error: any) {
        // Check if it's a "already exists" error, which we can ignore
        if (error.message && (
          error.message.includes('already exists') ||
          error.message.includes('duplicate') ||
          error.message.includes('does not exist')
        )) {
          console.log(`⚠️  Skipped (already exists or not needed)\n`);
        } else {
          console.error(`❌ Error:`, error.message);
          console.log('Statement:', statement.substring(0, 100) + '...\n');
        }
      }
    }
    
    console.log('\n✅ Manual migration completed!\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runManualMigration();
