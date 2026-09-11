const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugTestStart() {
  try {
    const skillId = 'cmtbpjzq0003hbi0ve7yy9zq';
    
    console.log('🔍 Debugging test start issue...\n');
    console.log('Skill ID from URL:', skillId);
    console.log('');

    // 1. Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      console.log('❌ SKILL NOT FOUND!');
      console.log('   The skillId in the URL does not exist in database.');
      return;
    }

    console.log('✅ Skill found:', skill.name);
    console.log('   Category:', skill.category);
    console.log('');

    // 2. Check student profile
    const student = await prisma.user.findUnique({
      where: { email: 'student@test.com' },
      include: {
        studentProfile: {
          include: {
            studentSkillSelections: {
              where: { skillId },
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!student || !student.studentProfile) {
      console.log('❌ STUDENT PROFILE NOT FOUND!');
      return;
    }

    const studentProfileId = student.studentProfile.id;
    console.log('✅ Student profile ID:', studentProfileId);
    console.log('');

    // 3. Check if student has self-rated this skill
    const selfRating = await prisma.studentSkillSelection.findUnique({
      where: {
        studentProfileId_skillId: {
          studentProfileId,
          skillId,
        },
      },
    });

    if (!selfRating) {
      console.log('❌ NO SELF-RATING FOUND FOR THIS SKILL!');
      console.log('   Student has not rated this skill in onboarding.');
      console.log('');
      
      // Show what skills they DID rate
      const allSelections = await prisma.studentSkillSelection.findMany({
        where: { studentProfileId },
        include: { skill: true },
      });

      if (allSelections.length === 0) {
        console.log('   Student has NO skills selected at all!');
        console.log('   Onboarding submission may have failed.');
      } else {
        console.log('   But student HAS rated these skills:');
        allSelections.forEach((sel, i) => {
          console.log(`   ${i + 1}. ${sel.skill.name} (${sel.skill.id}) - ${sel.selfRatedLevel}`);
        });
      }
      return;
    }

    console.log('✅ Self-rating found!');
    console.log('   Level:', selfRating.selfRatedLevel);
    console.log('');

    // 4. Check if questions exist for this skill
    const questionCount = await prisma.question.count({
      where: { skillId },
    });

    console.log(`Questions available: ${questionCount}`);
    
    if (questionCount === 0) {
      console.log('❌ NO QUESTIONS FOR THIS SKILL!');
      console.log('   Test cannot start without questions.');
      
      // Show which skills DO have questions
      const skillsWithQuestions = await prisma.skill.findMany({
        where: {
          questions: {
            some: {},
          },
        },
        include: {
          _count: {
            select: { questions: true },
          },
        },
        take: 10,
      });

      console.log('');
      console.log('   Skills with questions:');
      skillsWithQuestions.forEach(s => {
        console.log(`   - ${s.name}: ${s._count.questions} questions`);
      });
      
      return;
    }

    const questions = await prisma.question.findMany({
      where: { skillId },
      select: {
        difficultyLevel: true,
      },
    });

    const byDifficulty = {
      BEGINNER: questions.filter(q => q.difficultyLevel === 'BEGINNER').length,
      INTERMEDIATE: questions.filter(q => q.difficultyLevel === 'INTERMEDIATE').length,
      ADVANCED: questions.filter(q => q.difficultyLevel === 'ADVANCED').length,
    };

    console.log('   By difficulty:');
    console.log(`   - BEGINNER: ${byDifficulty.BEGINNER}`);
    console.log(`   - INTERMEDIATE: ${byDifficulty.INTERMEDIATE}`);
    console.log(`   - ADVANCED: ${byDifficulty.ADVANCED}`);
    console.log('');

    // 5. Check served questions
    const servedCount = await prisma.servedQuestion.count({
      where: {
        studentProfileId,
        question: { skillId },
      },
    });

    console.log(`Served questions: ${servedCount} (already shown to student)`);
    console.log(`Remaining: ${questionCount - servedCount}`);
    console.log('');

    // 6. All checks passed
    console.log('✅ ALL CHECKS PASSED!');
    console.log('');
    console.log('Test SHOULD start successfully.');
    console.log('If it still fails, check:');
    console.log('1. Browser console for JavaScript errors');
    console.log('2. Server terminal for API errors');
    console.log('3. Network tab for failed API calls');

  } catch (error) {
    console.error('❌ Error:', error);
    if (error.code === 'P2025') {
      console.log('\n⚠️  Record not found. This usually means:');
      console.log('   - Skill ID is invalid');
      console.log('   - Student has not completed onboarding');
      console.log('   - Database connection issue');
    }
  } finally {
    await prisma.$disconnect();
  }
}

debugTestStart();
