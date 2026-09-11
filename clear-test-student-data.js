// Clear all test data for student@test.com to start fresh testing
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearTestStudentData() {
  try {
    console.log('🧹 Clearing test student data...\n');

    // Find the test student
    const user = await prisma.user.findUnique({
      where: { email: 'student@test.com' },
      include: {
        studentProfile: true,
      },
    });

    if (!user || !user.studentProfile) {
      console.log('❌ Test student not found');
      return;
    }

    const studentProfileId = user.studentProfile.id;
    console.log(`✅ Found student profile: ${studentProfileId}\n`);

    // 1. Delete served questions
    const servedDeleted = await prisma.servedQuestion.deleteMany({
      where: { studentProfileId },
    });
    console.log(`🗑️  Deleted ${servedDeleted.count} served questions`);

    // 2. Delete test answers
    const answersDeleted = await prisma.testAnswer.deleteMany({
      where: {
        testAttempt: {
          studentProfileId,
        },
      },
    });
    console.log(`🗑️  Deleted ${answersDeleted.count} test answers`);

    // 3. Delete test attempts
    const attemptsDeleted = await prisma.testAttempt.deleteMany({
      where: { studentProfileId },
    });
    console.log(`🗑️  Deleted ${attemptsDeleted.count} test attempts`);

    // 4. Delete skill selections
    const selectionsDeleted = await prisma.studentSkillSelection.deleteMany({
      where: { studentProfileId },
    });
    console.log(`🗑️  Deleted ${selectionsDeleted.count} skill selections`);

    // 5. Reset student profile
    await prisma.studentProfile.update({
      where: { id: studentProfileId },
      data: {
        hasCompletedOnboarding: false,
        fieldId: null,
        goalId: null,
      },
    });
    console.log(`♻️  Reset student profile onboarding status`);

    // 6. Get skill profile
    const skillProfile = await prisma.skillProfile.findUnique({
      where: { studentProfileId },
    });

    if (skillProfile) {
      // Delete skill profile entries
      const entriesDeleted = await prisma.skillProfileEntry.deleteMany({
        where: { skillProfileId: skillProfile.id },
      });
      console.log(`🗑️  Deleted ${entriesDeleted.count} skill profile entries`);
    }

    console.log('\n✅ Test student data cleared successfully!');
    console.log('   You can now go through onboarding fresh.\n');
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearTestStudentData();
