import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating test users...\n');

  // Password: password123 (same for all test users)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test student
  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      passwordHash: hashedPassword,
      name: 'Test Student',
      role: 'STUDENT',
      studentProfile: {
        create: {
          institutionName: 'Test University',
          course: 'Computer Science',
          yearOfStudy: 3,
          bio: 'Test student account',
        },
      },
    },
  });

  console.log('✅ Created student:', student.email);

  // Create test company
  const company = await prisma.user.upsert({
    where: { email: 'company@test.com' },
    update: {},
    create: {
      email: 'company@test.com',
      passwordHash: hashedPassword,
      name: 'Test Company',
      role: 'INDUSTRY',
      industryProfile: {
        create: {
          companyName: 'Test Corp',
          industryType: 'Technology',
          description: 'Test company account',
        },
      },
    },
  });

  console.log('✅ Created company:', company.email);

  // Create test professor
  const professor = await prisma.user.upsert({
    where: { email: 'professor@test.com' },
    update: {},
    create: {
      email: 'professor@test.com',
      passwordHash: hashedPassword,
      name: 'Test Professor',
      role: 'ACADEMICIAN',
      academicianProfile: {
        create: {
          institutionName: 'Test University',
          department: 'Computer Science',
          designation: 'Professor',
        },
      },
    },
  });

  console.log('✅ Created professor:', professor.email);

  console.log('\n🎉 Test users created successfully!');
  console.log('\nLogin credentials:');
  console.log('  Student:   student@test.com / password123');
  console.log('  Company:   company@test.com / password123');
  console.log('  Professor: professor@test.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
