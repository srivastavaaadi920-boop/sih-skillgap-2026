const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function auditCoverage() {
  try {
    console.log('🔍 AUDITING QUESTION COVERAGE\n');
    console.log('='.repeat(80));

    // Get all skills
    const allSkills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });

    console.log(`\n📊 Total skills in database: ${allSkills.length}\n`);

    // Get questions grouped by skill and difficulty
    const skillsWithQuestions = await prisma.skill.findMany({
      where: {
        questions: {
          some: {},
        },
      },
      include: {
        questions: {
          select: {
            difficultyLevel: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    console.log(`✅ Skills with questions: ${skillsWithQuestions.length}\n`);
    console.log('DETAILED COVERAGE:\n');

    const fullyCovered = [];
    const partiallyCovered = [];
    const noCoverage = [];

    for (const skill of allSkills) {
      const skillWithQ = skillsWithQuestions.find(s => s.id === skill.id);
      
      if (!skillWithQ || skillWithQ.questions.length === 0) {
        noCoverage.push(skill);
        continue;
      }

      const beginner = skillWithQ.questions.filter(q => q.difficultyLevel === 'BEGINNER').length;
      const intermediate = skillWithQ.questions.filter(q => q.difficultyLevel === 'INTERMEDIATE').length;
      const advanced = skillWithQ.questions.filter(q => q.difficultyLevel === 'ADVANCED').length;
      const total = skillWithQ.questions.length;

      const hasFullCoverage = beginner > 0 && intermediate > 0 && advanced > 0;

      const coverage = {
        skill,
        beginner,
        intermediate,
        advanced,
        total,
        hasFullCoverage,
      };

      if (hasFullCoverage) {
        fullyCovered.push(coverage);
      } else {
        partiallyCovered.push(coverage);
      }
    }

    // Print fully covered skills (can be offered)
    console.log('✅ FULLY COVERED SKILLS (All 3 difficulty levels):');
    console.log('-'.repeat(80));
    fullyCovered.forEach((c, i) => {
      console.log(`${i + 1}. ${c.skill.name} (${c.skill.category})`);
      console.log(`   Beginner: ${c.beginner} | Intermediate: ${c.intermediate} | Advanced: ${c.advanced} | Total: ${c.total}`);
      console.log(`   Skill ID: ${c.skill.id}`);
      console.log('');
    });

    // Print partially covered skills (should NOT be offered)
    if (partiallyCovered.length > 0) {
      console.log('\n⚠️  PARTIALLY COVERED SKILLS (Missing some difficulty levels):');
      console.log('-'.repeat(80));
      partiallyCovered.forEach((c, i) => {
        const missing = [];
        if (c.beginner === 0) missing.push('BEGINNER');
        if (c.intermediate === 0) missing.push('INTERMEDIATE');
        if (c.advanced === 0) missing.push('ADVANCED');
        
        console.log(`${i + 1}. ${c.skill.name} (${c.skill.category})`);
        console.log(`   Beginner: ${c.beginner} | Intermediate: ${c.intermediate} | Advanced: ${c.advanced} | Total: ${c.total}`);
        console.log(`   MISSING: ${missing.join(', ')}`);
        console.log(`   ⛔ Should NOT be offered until fixed`);
        console.log('');
      });
    }

    // Print skills with no coverage
    if (noCoverage.length > 0) {
      console.log('\n❌ NO COVERAGE (No questions at all):');
      console.log('-'.repeat(80));
      console.log(`Total: ${noCoverage.length} skills\n`);
      noCoverage.slice(0, 10).forEach((s, i) => {
        console.log(`${i + 1}. ${s.name} (${s.category})`);
      });
      if (noCoverage.length > 10) {
        console.log(`... and ${noCoverage.length - 10} more`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY:');
    console.log('='.repeat(80));
    console.log(`Total Skills: ${allSkills.length}`);
    console.log(`✅ Fully Covered (offer these): ${fullyCovered.length}`);
    console.log(`⚠️  Partially Covered (fix or hide): ${partiallyCovered.length}`);
    console.log(`❌ No Coverage (hide): ${noCoverage.length}`);
    console.log('');
    console.log(`📝 Recommendation: Offer only the ${fullyCovered.length} fully covered skills`);
    console.log('');

    // Generate SQL for easy reference
    if (fullyCovered.length > 0) {
      console.log('Skill IDs to offer (copy for filtering):');
      const ids = fullyCovered.map(c => `'${c.skill.id}'`).join(',\n  ');
      console.log(`[\n  ${ids}\n]`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

auditCoverage();
