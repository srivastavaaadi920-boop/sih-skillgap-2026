import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Checking for users...\n');
    
    const email = 'aadi.srivastava37@nmims.in';
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
      },
    });

    if (user) {
      console.log('✅ User found:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Has password: ${user.passwordHash ? 'Yes' : 'No'}`);
      console.log(`   Student profile: ${user.studentProfile ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ User not found with email:', email);
      console.log('\nTrying to find any users...');
      
      const allUsers = await prisma.user.findMany({
        take: 5,
      });
      
      console.log(`\nFound ${allUsers.length} users in database:`);
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
      });
    }
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
