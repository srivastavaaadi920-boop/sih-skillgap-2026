import { PrismaClient } from '@prisma/client';
import { calculateHybridMatch, calculateSimpleMatch } from '../lib/matching-hybrid';

const prisma = new PrismaClient();

async function testHybridMatching() {
  console.log('\n🧪 TESTING HYBRID MATCHING ENGINE\n');
  console.log('=' .repeat(80));

  try {
    // Get first student with skill profile
    const student = await prisma.studentProfile.findFirst({
      include: {
        user: true,
        skillProfile: {
          include: {
            entries: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    if (!student || !student.skillProfile) {
      console.log('❌ No student with skill profile found');
      console.log('   Please complete the skill assessment first');
      return;
    }

    console.log(`\n👤 Testing with: ${student.user.name} (${student.user.email})`);
    console.log(`   Skills assessed: ${student.skillProfile.entries.length}`);

    const studentSkills = student.skillProfile.entries.map(entry => ({
      skillId: entry.skillId,
      skillName: entry.skill.name,
      proficiencyLevel: entry.proficiencyLevel,
    }));

    console.log('\n   Top 10 student skills:');
    studentSkills
      .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
      .slice(0, 10)
      .forEach(s => {
        console.log(`      ${s.skillName}: ${s.proficiencyLevel}/5`);
      });

    // Get all opportunities
    const opportunities = await prisma.opportunity.findMany({
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    console.log(`\n\n📋 Testing against ${opportunities.length} opportunities:\n`);
    console.log('='.repeat(80));

    // Test each opportunity
    for (const opp of opportunities) {
      console.log(`\n📌 ${opp.title} (${opp.type})`);

      const requiredSkills = opp.requiredSkills.map(rs => ({
        skillId: rs.skillId,
        skillName: rs.skill.name,
        minProficiency: rs.minProficiency,
      }));

      console.log(`   Required skills: ${requiredSkills.length}`);
      requiredSkills.forEach(rs => {
        console.log(`      - ${rs.skillName} (min: ${rs.minProficiency}/5)`);
      });

      if (requiredSkills.length === 0) {
        console.log('   ⚠️  NO REQUIRED SKILLS - This is the bug!');
        continue;
      }

      // Test with simple matching first
      const simpleResult = calculateSimpleMatch(studentSkills, requiredSkills);

      // Test with hybrid matching
      console.log('\n   🔄 Running hybrid match...');
      const hybridResult = await calculateHybridMatch(studentSkills, requiredSkills);

      // Display results
      console.log(`\n   📊 RESULTS:`);
      console.log(`      Simple Match Score: ${simpleResult.overallScore}%`);
      console.log(`      Hybrid Match Score: ${hybridResult.overallScore}%`);
      
      console.log(`\n   📈 Breakdown:`);
      console.log(`      Exact matches: ${hybridResult.breakdown.exactMatchCount}`);
      console.log(`      Semantic matches: ${hybridResult.breakdown.semanticMatchCount}`);
      console.log(`      Gaps: ${hybridResult.breakdown.gapCount}`);

      if (hybridResult.exactMatches.length > 0) {
        console.log(`\n   ✅ Exact Matches:`);
        hybridResult.exactMatches.forEach(m => {
          console.log(`      ${m.requiredSkillName}: student ${m.studentProficiency}/5 vs required ${m.requiredProficiency}/5 (ratio: ${m.proficiencyRatio.toFixed(2)})`);
        });
      }

      if (hybridResult.semanticMatches.length > 0) {
        console.log(`\n   🔗 Semantic Matches:`);
        hybridResult.semanticMatches.forEach(m => {
          console.log(`      "${m.requiredSkillName}" ≈ "${m.matchedStudentSkillName}" (similarity: ${m.similarityScore.toFixed(2)})`);
          console.log(`         student ${m.studentProficiency}/5 vs required ${m.requiredProficiency}/5`);
        });
      }

      if (hybridResult.gapSkills.length > 0) {
        console.log(`\n   ❌ Gap Skills:`);
        hybridResult.gapSkills.forEach(g => {
          console.log(`      ${g.requiredSkillName} (need: ${g.requiredProficiency}/5)`);
        });
      }

      console.log('\n' + '-'.repeat(80));
    }

    console.log('\n\n📝 SUMMARY TABLE:\n');
    console.log('Opportunity'.padEnd(35) + ' | Exact | Semantic | Gaps | Score');
    console.log('='.repeat(80));

    for (const opp of opportunities) {
      const requiredSkills = opp.requiredSkills.map(rs => ({
        skillId: rs.skillId,
        skillName: rs.skill.name,
        minProficiency: rs.minProficiency,
      }));

      if (requiredSkills.length === 0) {
        console.log(opp.title.padEnd(35) + ' | NO REQUIRED SKILLS!');
        continue;
      }

      const result = await calculateHybridMatch(studentSkills, requiredSkills);
      
      console.log(
        opp.title.substring(0, 34).padEnd(35) +
        ' | ' +
        String(result.breakdown.exactMatchCount).padStart(5) +
        ' | ' +
        String(result.breakdown.semanticMatchCount).padStart(8) +
        ' | ' +
        String(result.breakdown.gapCount).padStart(4) +
        ' | ' +
        String(result.overallScore).padStart(3) +
        '%'
      );
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Testing complete\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testHybridMatching();
