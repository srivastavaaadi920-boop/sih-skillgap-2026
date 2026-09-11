// Verify which skills are available for testing (have full 3-tier coverage)
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyAvailableSkills() {
  try {
    console.log('🔍 Checking available skills for testing...\n');

    // Get all skills with at least 1 question
    const skillsWithQuestions = await prisma.skill.findMany({
      where: {
        questions: {
          some: {},
        },
      },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
        questions: {
          select: {
            difficultyLevel: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`📊 Total skills with questions: ${skillsWithQuestions.length}\n`);

    // Check coverage for each skill
    const skillsWithFullCoverage = [];
    const skillsWithPartialCoverage = [];

    for (const skill of skillsWithQuestions) {
      const levels = new Set(skill.questions.map(q => q.difficultyLevel));
      const hasFullCoverage = 
        levels.has('BEGINNER') && 
        levels.has('INTERMEDIATE') && 
        levels.has('ADVANCED');

      const coverageInfo = {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        totalQuestions: skill._count.questions,
        coverage: {
          BEGINNER: skill.questions.filter(q => q.difficultyLevel === 'BEGINNER').length,
          INTERMEDIATE: skill.questions.filter(q => q.difficultyLevel === 'INTERMEDIATE').length,
          ADVANCED: skill.questions.filter(q => q.difficultyLevel === 'ADVANCED').length,
        },
      };

      if (hasFullCoverage) {
        skillsWithFullCoverage.push(coverageInfo);
      } else {
        skillsWithPartialCoverage.push(coverageInfo);
      }
    }

    // Display full coverage skills
    console.log(`✅ SKILLS WITH FULL COVERAGE (${skillsWithFullCoverage.length} skills):`);
    console.log('   These are safe to test:\n');
    
    for (const skill of skillsWithFullCoverage) {
      console.log(`   📌 ${skill.name} (${skill.category})`);
      console.log(`      Total: ${skill.totalQuestions} questions`);
      console.log(`      B: ${skill.coverage.BEGINNER}, I: ${skill.coverage.INTERMEDIATE}, A: ${skill.coverage.ADVANCED}\n`);
    }

    // Display partial coverage skills
    if (skillsWithPartialCoverage.length > 0) {
      console.log(`\n⚠️  SKILLS WITH PARTIAL COVERAGE (${skillsWithPartialCoverage.length} skills):`);
      console.log('   These should NOT be offered until gaps are filled:\n');
      
      for (const skill of skillsWithPartialCoverage) {
        const missing = [];
        if (skill.coverage.BEGINNER === 0) missing.push('BEGINNER');
        if (skill.coverage.INTERMEDIATE === 0) missing.push('INTERMEDIATE');
        if (skill.coverage.ADVANCED === 0) missing.push('ADVANCED');
        
        console.log(`   ⚠️  ${skill.name} (${skill.category})`);
        console.log(`      Total: ${skill.totalQuestions} questions`);
        console.log(`      B: ${skill.coverage.BEGINNER}, I: ${skill.coverage.INTERMEDIATE}, A: ${skill.coverage.ADVANCED}`);
        console.log(`      Missing: ${missing.join(', ')}\n`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 SUMMARY:');
    console.log(`   ✅ ${skillsWithFullCoverage.length} skills ready for testing`);
    console.log(`   ⚠️  ${skillsWithPartialCoverage.length} skills need more questions`);
    console.log('='.repeat(60) + '\n');

    // List skill names for easy copy-paste
    console.log('✅ Ready skill names:');
    console.log(skillsWithFullCoverage.map(s => s.name).join(', '));
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAvailableSkills();
