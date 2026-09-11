import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Fields and Goals...\n');

  // Clear existing data
  await prisma.goal.deleteMany({});
  await prisma.field.deleteMany({});

  // Field 1: Software Development
  const softwareDev = await prisma.field.create({
    data: {
      name: 'Software Development',
      goals: {
        create: [
          { title: 'Frontend Developer' },
          { title: 'Backend Developer' },
          { title: 'Full Stack Developer' },
          { title: 'Mobile App Developer' },
        ],
      },
    },
  });

  // Field 2: Data Science & Analytics
  const dataScience = await prisma.field.create({
    data: {
      name: 'Data Science & Analytics',
      goals: {
        create: [
          { title: 'Data Analyst' },
          { title: 'Data Scientist' },
          { title: 'Business Intelligence Analyst' },
          { title: 'Machine Learning Engineer' },
        ],
      },
    },
  });

  // Field 3: Digital Marketing
  const digitalMarketing = await prisma.field.create({
    data: {
      name: 'Digital Marketing',
      goals: {
        create: [
          { title: 'Digital Marketing Specialist' },
          { title: 'SEO/SEM Specialist' },
          { title: 'Social Media Manager' },
          { title: 'Content Marketing Manager' },
        ],
      },
    },
  });

  // Field 4: UI/UX Design
  const uiuxDesign = await prisma.field.create({
    data: {
      name: 'UI/UX Design',
      goals: {
        create: [
          { title: 'UI Designer' },
          { title: 'UX Researcher' },
          { title: 'Product Designer' },
          { title: 'Interaction Designer' },
        ],
      },
    },
  });

  // Field 5: DevOps & Cloud
  const devOps = await prisma.field.create({
    data: {
      name: 'DevOps & Cloud Engineering',
      goals: {
        create: [
          { title: 'DevOps Engineer' },
          { title: 'Cloud Architect' },
          { title: 'Site Reliability Engineer' },
          { title: 'Infrastructure Engineer' },
        ],
      },
    },
  });

  // Field 6: Cybersecurity
  const cybersecurity = await prisma.field.create({
    data: {
      name: 'Cybersecurity',
      goals: {
        create: [
          { title: 'Security Analyst' },
          { title: 'Penetration Tester' },
          { title: 'Security Engineer' },
          { title: 'Security Consultant' },
        ],
      },
    },
  });

  // Field 7: Product Management
  const productManagement = await prisma.field.create({
    data: {
      name: 'Product Management',
      goals: {
        create: [
          { title: 'Product Manager' },
          { title: 'Product Owner' },
          { title: 'Technical Product Manager' },
        ],
      },
    },
  });

  // Field 8: Core Engineering (Mechanical, Electrical, Civil)
  const coreEngineering = await prisma.field.create({
    data: {
      name: 'Core Engineering',
      goals: {
        create: [
          { title: 'Mechanical Engineer' },
          { title: 'Electrical Engineer' },
          { title: 'Civil Engineer' },
          { title: 'Production Engineer' },
        ],
      },
    },
  });

  // Field 9: Quality Assurance & Testing
  const qaTest = await prisma.field.create({
    data: {
      name: 'Quality Assurance & Testing',
      goals: {
        create: [
          { title: 'QA Engineer' },
          { title: 'Test Automation Engineer' },
          { title: 'Performance Testing Engineer' },
        ],
      },
    },
  });

  // Count results
  const fieldCount = await prisma.field.count();
  const goalCount = await prisma.goal.count();

  console.log('✅ Seed completed!');
  console.log(`   Fields created: ${fieldCount}`);
  console.log(`   Goals created: ${goalCount}\n`);

  // Display summary
  const fieldsWithGoals = await prisma.field.findMany({
    include: {
      goals: true,
    },
  });

  console.log('📋 Fields and Goals Summary:\n');
  fieldsWithGoals.forEach((field) => {
    console.log(`📌 ${field.name} (${field.goals.length} goals)`);
    field.goals.forEach((goal) => {
      console.log(`   - ${goal.title}`);
    });
    console.log('');
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
