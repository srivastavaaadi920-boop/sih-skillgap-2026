import { PrismaClient, SkillCategory } from '@prisma/client';

const prisma = new PrismaClient();

const technicalSkills = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'SQL',
  'React',
  'Node.js',
  'Angular',
  'Vue.js',
  'TypeScript',
  'Data Analysis',
  'Data Visualization',
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing (AWS/Azure/GCP)',
  'Docker',
  'Kubernetes',
  'Git Version Control',
  'REST APIs',
  'GraphQL',
  'MongoDB',
  'PostgreSQL',
  'HTML/CSS',
  'UI/UX Design',
  'Mobile Development',
  'Cybersecurity',
  'DevOps',
  'Agile/Scrum',
  'Excel/Spreadsheets',
  'Power BI/Tableau',
];

const softSkills = [
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Leadership',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
  'Creativity',
  'Emotional Intelligence',
  'Conflict Resolution',
  'Active Listening',
  'Presentation Skills',
  'Negotiation',
  'Decision Making',
  'Work Ethic',
  'Attention to Detail',
  'Collaboration',
  'Stress Management',
  'Networking',
  'Self-Motivation',
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing skills
  await prisma.skill.deleteMany({});
  console.log('🗑️  Cleared existing skills');

  // Seed technical skills
  const technicalSkillsData = technicalSkills.map((name) => ({
    name,
    category: SkillCategory.TECHNICAL,
  }));

  // Seed soft skills
  const softSkillsData = softSkills.map((name) => ({
    name,
    category: SkillCategory.SOFT,
  }));

  // Insert all skills
  const allSkills = [...technicalSkillsData, ...softSkillsData];
  
  for (const skill of allSkills) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log(`✅ Created ${technicalSkills.length} technical skills`);
  console.log(`✅ Created ${softSkills.length} soft skills`);
  console.log(`✅ Total: ${allSkills.length} skills seeded`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
