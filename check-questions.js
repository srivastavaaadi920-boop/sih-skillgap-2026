const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkQuestions() {
  try {
    console.log('🔍 Checking database for questions...\n');

    // Count total questions
    const totalQuestions = await prisma.question.count();
    console.log(`📊 Total questions in database: ${totalQuestions}\n`);

    if (totalQuestions === 0) {
      console.log('❌ NO QUESTIONS FOUND! Need to run seed.');
      console.log('   Run: npm run prisma:seed');
      return;
    }

    // Get first 5 skills
    const skills = await prisma.skill.findMany({ take: 10 });
    console.log('📋 Skills in database:');
    skills.forEach(s => console.log(`   - ${s.name} (${s.id})`));
    console.log('');

    // Check questions for first skill
    if (skills.length > 0) {
      const firstSkillId = skills[0].id;
      const questionsForSkill = await prisma.question.findMany({
        where: { skillId: firstSkillId },
        include: { skill: true },
      });

      console.log(`❓ Questions for "${skills[0].name}":`);
      console.log(`   Total: ${questionsForSkill.length}`);
      
      if (questionsForSkill.length > 0) {
        console.log('\n   Sample question:');
        const sample = questionsForSkill[0];
        console.log(`   Type: ${sample.type}`);
        console.log(`   Difficulty: ${sample.difficultyLevel}`);
        console.log(`   Prompt: ${sample.promptText.substring(0, 100)}...`);
        console.log(`   Options: ${JSON.parse(sample.options).length} choices`);
      }
    }

    // Count by difficulty
    const byDifficulty = await prisma.question.groupBy({
      by: ['difficultyLevel'],
      _count: true,
    });

    console.log('\n📈 Questions by difficulty:');
    byDifficulty.forEach(d => {
      console.log(`   ${d.difficultyLevel}: ${d._count} questions`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuestions();
