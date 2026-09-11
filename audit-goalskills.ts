import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditGoalSkills() {
  console.log('='.repeat(80));
  console.log('GOALSKILL AUDIT REPORT');
  console.log('='.repeat(80));
  console.log();

  try {
    // 1. Total count of Goal records
    const totalGoals = await prisma.goal.count();
    console.log(`📊 TOTAL GOALS: ${totalGoals}`);
    console.log();

    // 2. Goals with ZERO GoalSkill entries
    const goalsWithSkills = await prisma.goal.findMany({
      include: {
        goalSkills: true,
        field: true,
      },
    });

    const goalsWithZeroSkills = goalsWithSkills.filter(
      (goal) => goal.goalSkills.length === 0
    );

    console.log(`❌ GOALS WITH ZERO GOALSKILLS: ${goalsWithZeroSkills.length}`);
    if (goalsWithZeroSkills.length > 0) {
      console.log('   Missing GoalSkill entries for:');
      goalsWithZeroSkills.forEach((goal) => {
        console.log(`   - "${goal.title}" (Field: ${goal.field.name})`);
      });
    }
    console.log();

    // 3. Goals with fewer than 4 GoalSkill entries
    const goalsWithFewSkills = goalsWithSkills.filter(
      (goal) => goal.goalSkills.length > 0 && goal.goalSkills.length < 4
    );

    console.log(`⚠️  GOALS WITH < 4 GOALSKILLS: ${goalsWithFewSkills.length}`);
    if (goalsWithFewSkills.length > 0) {
      console.log('   Incomplete GoalSkill entries:');
      goalsWithFewSkills.forEach((goal) => {
        console.log(
          `   - "${goal.title}" (Field: ${goal.field.name}) - ${goal.goalSkills.length} skills`
        );
      });
    }
    console.log();

    // 4. Goals with 4+ GoalSkill entries (healthy)
    const goalsWithHealthySkills = goalsWithSkills.filter(
      (goal) => goal.goalSkills.length >= 4
    );

    console.log(`✅ GOALS WITH 4+ GOALSKILLS: ${goalsWithHealthySkills.length}`);
    if (goalsWithHealthySkills.length > 0) {
      console.log('   Sample of healthy goals:');
      goalsWithHealthySkills.slice(0, 5).forEach((goal) => {
        console.log(
          `   - "${goal.title}" (Field: ${goal.field.name}) - ${goal.goalSkills.length} skills`
        );
      });
      if (goalsWithHealthySkills.length > 5) {
        console.log(`   ... and ${goalsWithHealthySkills.length - 5} more`);
      }
    }
    console.log();

    // 5. Breakdown by Domain
    const techGoals = goalsWithSkills.filter(
      (goal) => goal.field.domain === 'TECHNOLOGY'
    );
    const ayushGoals = goalsWithSkills.filter(
      (goal) => goal.field.domain === 'AYUSH'
    );

    console.log(`📈 BREAKDOWN BY DOMAIN:`);
    console.log(`   TECHNOLOGY: ${techGoals.length} goals`);
    console.log(
      `     - Missing GoalSkills: ${
        techGoals.filter((g) => g.goalSkills.length === 0).length
      }`
    );
    console.log(
      `     - Incomplete (<4): ${
        techGoals.filter((g) => g.goalSkills.length > 0 && g.goalSkills.length < 4)
          .length
      }`
    );
    console.log(
      `     - Complete (4+): ${
        techGoals.filter((g) => g.goalSkills.length >= 4).length
      }`
    );
    console.log();

    console.log(`   AYUSH: ${ayushGoals.length} goals`);
    console.log(
      `     - Missing GoalSkills: ${
        ayushGoals.filter((g) => g.goalSkills.length === 0).length
      }`
    );
    console.log(
      `     - Incomplete (<4): ${
        ayushGoals.filter((g) => g.goalSkills.length > 0 && g.goalSkills.length < 4)
          .length
      }`
    );
    console.log(
      `     - Complete (4+): ${
        ayushGoals.filter((g) => g.goalSkills.length >= 4).length
      }`
    );
    console.log();

    console.log('='.repeat(80));
    console.log('AUDIT COMPLETE');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ Audit failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

auditGoalSkills();
