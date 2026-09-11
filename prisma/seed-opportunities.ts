import { PrismaClient, OpportunityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting opportunity seed...');

  // Create a test industry profile if it doesn't exist
  let industryUser = await prisma.user.findFirst({
    where: { role: 'INDUSTRY' },
    include: { industryProfile: true },
  });

  if (!industryUser || !industryUser.industryProfile) {
    console.log('Creating test industry user...');
    industryUser = await prisma.user.create({
      data: {
        email: 'techcorp@test.com',
        passwordHash: '$2a$10$example', // Dummy hash
        name: 'TechCorp Solutions',
        role: 'INDUSTRY',
        industryProfile: {
          create: {
            companyName: 'TechCorp Solutions',
            industryType: 'Technology',
            website: 'https://techcorp.example.com',
            description: 'Leading technology company offering innovative solutions',
          },
        },
      },
      include: { industryProfile: true },
    });
  }

  const industryProfileId = industryUser.industryProfile!.id;

  // Get skills for opportunities
  const skills = await prisma.skill.findMany();
  const skillMap = new Map(skills.map((s) => [s.name, s.id]));

  // Clear existing opportunities
  await prisma.opportunity.deleteMany({});
  console.log('🗑️  Cleared existing opportunities');

  // Opportunity 1: Frontend Developer Intern
  const frontendOpportunity = await prisma.opportunity.create({
    data: {
      industryProfileId,
      title: 'Frontend Developer Intern',
      description:
        'Join our team to build modern web applications using React and TypeScript. Perfect for students with strong JavaScript fundamentals.',
      type: OpportunityType.INTERNSHIP,
      location: 'Bangalore',
      isRemote: false,
      deadline: new Date('2026-12-31'),
      status: 'OPEN',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: frontendOpportunity.id, skillId: skillMap.get('JavaScript')!, minProficiency: 3 },
      { opportunityId: frontendOpportunity.id, skillId: skillMap.get('React')!, minProficiency: 3 },
      { opportunityId: frontendOpportunity.id, skillId: skillMap.get('HTML/CSS')!, minProficiency: 3 },
      { opportunityId: frontendOpportunity.id, skillId: skillMap.get('Git Version Control')!, minProficiency: 2 },
      { opportunityId: frontendOpportunity.id, skillId: skillMap.get('Communication')!, minProficiency: 3 },
    ],
  });

  // Opportunity 2: Data Analyst Trainee
  const dataAnalystOpportunity = await prisma.opportunity.create({
    data: {
      industryProfileId,
      title: 'Data Analyst Trainee',
      description:
        'Analyze business data and create insightful reports. Training provided for the right candidate with solid fundamentals.',
      type: OpportunityType.TRAINING,
      location: 'Mumbai',
      isRemote: true,
      deadline: new Date('2026-11-30'),
      status: 'OPEN',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: dataAnalystOpportunity.id, skillId: skillMap.get('Python')!, minProficiency: 2 },
      { opportunityId: dataAnalystOpportunity.id, skillId: skillMap.get('SQL')!, minProficiency: 3 },
      { opportunityId: dataAnalystOpportunity.id, skillId: skillMap.get('Data Analysis')!, minProficiency: 3 },
      { opportunityId: dataAnalystOpportunity.id, skillId: skillMap.get('Excel/Spreadsheets')!, minProficiency: 3 },
      { opportunityId: dataAnalystOpportunity.id, skillId: skillMap.get('Communication')!, minProficiency: 3 },
      { opportunityId: dataAnalystOpportunity.id, skillId: skillMap.get('Critical Thinking')!, minProficiency: 3 },
    ],
  });

  // Opportunity 3: Full Stack Developer
  const fullStackOpportunity = await prisma.opportunity.create({
    data: {
      industryProfileId,
      title: 'Full Stack Developer',
      description:
        'Build end-to-end web applications. Requires strong skills in both frontend and backend technologies.',
      type: OpportunityType.JOB,
      location: 'Pune',
      isRemote: true,
      deadline: new Date('2027-01-15'),
      status: 'OPEN',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: fullStackOpportunity.id, skillId: skillMap.get('JavaScript')!, minProficiency: 4 },
      { opportunityId: fullStackOpportunity.id, skillId: skillMap.get('React')!, minProficiency: 4 },
      { opportunityId: fullStackOpportunity.id, skillId: skillMap.get('Node.js')!, minProficiency: 4 },
      { opportunityId: fullStackOpportunity.id, skillId: skillMap.get('MongoDB')!, minProficiency: 3 },
      { opportunityId: fullStackOpportunity.id, skillId: skillMap.get('REST APIs')!, minProficiency: 3 },
      { opportunityId: fullStackOpportunity.id, skillId: skillMap.get('Problem Solving')!, minProficiency: 4 },
    ],
  });

  // Opportunity 4: Machine Learning Intern
  const mlOpportunity = await prisma.opportunity.create({
    data: {
      industryProfileId,
      title: 'Machine Learning Intern',
      description:
        'Work on cutting-edge AI/ML projects. Ideal for students with strong Python and ML fundamentals.',
      type: OpportunityType.INTERNSHIP,
      location: 'Hyderabad',
      isRemote: false,
      deadline: new Date('2026-10-31'),
      status: 'OPEN',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: mlOpportunity.id, skillId: skillMap.get('Python')!, minProficiency: 4 },
      { opportunityId: mlOpportunity.id, skillId: skillMap.get('Machine Learning')!, minProficiency: 3 },
      { opportunityId: mlOpportunity.id, skillId: skillMap.get('Data Analysis')!, minProficiency: 3 },
      { opportunityId: mlOpportunity.id, skillId: skillMap.get('Critical Thinking')!, minProficiency: 4 },
      { opportunityId: mlOpportunity.id, skillId: skillMap.get('Problem Solving')!, minProficiency: 4 },
    ],
  });

  // Opportunity 5: Cloud DevOps Engineer
  const devopsOpportunity = await prisma.opportunity.create({
    data: {
      industryProfileId,
      title: 'Cloud DevOps Engineer',
      description:
        'Manage cloud infrastructure and CI/CD pipelines. Great opportunity for students interested in modern DevOps practices.',
      type: OpportunityType.JOB,
      location: 'Remote',
      isRemote: true,
      deadline: new Date('2027-02-28'),
      status: 'OPEN',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: devopsOpportunity.id, skillId: skillMap.get('Cloud Computing (AWS/Azure/GCP)')!, minProficiency: 3 },
      { opportunityId: devopsOpportunity.id, skillId: skillMap.get('Docker')!, minProficiency: 3 },
      { opportunityId: devopsOpportunity.id, skillId: skillMap.get('Kubernetes')!, minProficiency: 2 },
      { opportunityId: devopsOpportunity.id, skillId: skillMap.get('Git Version Control')!, minProficiency: 3 },
      { opportunityId: devopsOpportunity.id, skillId: skillMap.get('Problem Solving')!, minProficiency: 3 },
    ],
  });

  // Opportunity 6: UI/UX Design Intern
  const designOpportunity = await prisma.opportunity.create({
    data: {
      industryProfileId,
      title: 'UI/UX Design Intern',
      description:
        'Create beautiful and functional user interfaces. Collaborate with our design team to deliver exceptional user experiences.',
      type: OpportunityType.INTERNSHIP,
      location: 'Delhi',
      isRemote: true,
      deadline: new Date('2026-12-15'),
      status: 'OPEN',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: designOpportunity.id, skillId: skillMap.get('UI/UX Design')!, minProficiency: 3 },
      { opportunityId: designOpportunity.id, skillId: skillMap.get('HTML/CSS')!, minProficiency: 2 },
      { opportunityId: designOpportunity.id, skillId: skillMap.get('Creativity')!, minProficiency: 4 },
      { opportunityId: designOpportunity.id, skillId: skillMap.get('Communication')!, minProficiency: 3 },
      { opportunityId: designOpportunity.id, skillId: skillMap.get('Collaboration')!, minProficiency: 3 },
    ],
  });

  console.log('✅ Created 6 opportunities with required skills');
  console.log('📊 Opportunity types: 3 Internships, 2 Jobs, 1 Training');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
