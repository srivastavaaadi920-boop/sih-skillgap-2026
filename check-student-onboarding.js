const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkStudentOnboarding() {
  try {
    console.log('🔍 Checking student onboarding status...\n');

    const student = await prisma.user.findUnique({
      where: { email: 'student@test.com' },
      include: {
        studentProfile: {
          include: {
            field: true,
            goal: true,
            studentSkillSelections: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      console.log('❌ Student not found!');
      return;
    }

    console.log('✅ Student found:', student.email);
    console.log('   Name:', student.name);
    console.log('');

    const profile = student.studentProfile;
    if (!profile) {
      console.log('❌ No student profile!');
      return;
    }

    console.log('Student Profile:');
    console.log('  Field:', profile.field?.name || '❌ NOT SET');
    console.log('  Goal:', profile.goal?.title || '❌ NOT SET');
    console.log('  Skills selected:', profile.studentSkillSelections.length);
    console.log('');

    if (profile.studentSkillSelections.length === 0) {
      console.log('⚠️  NO SKILLS SELECTED!');
      console.log('   Student must complete onboarding first.');
      console.log('   Go to: /student/onboarding');
      return;
    }

    console.log('Selected Skills:');
    profile.studentSkillSelections.forEach((sel, i) => {
      console.log(`  ${i + 1}. ${sel.skill.name} - Self-rated: ${sel.selfRatedLevel}`);
      console.log(`     Skill ID: ${sel.skillId}`);
    });

    console.log('');
    console.log('✅ Student can take tests for these skills!');
    console.log('   Example test URL: /student/test/' + profile.studentSkillSelections[0].skillId);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentOnboarding();
