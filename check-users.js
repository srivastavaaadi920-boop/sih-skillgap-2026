const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');

    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
      },
    });

    console.log(`👥 Total users: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ NO USERS FOUND IN DATABASE!');
      console.log('   You need to create users first.\n');
      return;
    }

    console.log('Users in database:');
    users.forEach(user => {
      console.log(`\n  Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Has password: ${user.passwordHash ? 'Yes' : 'No'}`);
      console.log(`  Student profile: ${user.studentProfile ? 'Yes' : 'No'}`);
    });

    console.log('\n💡 To login, use these credentials:');
    users.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: [check seed script or create new user]`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('connect')) {
      console.log('\n⚠️  DATABASE CONNECTION FAILED');
      console.log('   Your mobile hotspot may be unstable.');
      console.log('   Either:');
      console.log('   1. Enable MOCK_MODE="true" in .env');
      console.log('   2. Or ensure stable database connection');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
