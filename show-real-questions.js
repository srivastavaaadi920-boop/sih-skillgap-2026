const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showRealQuestions() {
  try {
    console.log('📚 REAL QUESTIONS FROM DATABASE\n');
    console.log('=' .repeat(80));

    // Get JavaScript questions
    const jsSkill = await prisma.skill.findFirst({
      where: { name: 'JavaScript' }
    });

    if (!jsSkill) {
      console.log('❌ JavaScript skill not found');
      return;
    }

    const jsQuestions = await prisma.question.findMany({
      where: { skillId: jsSkill.id },
      take: 3,
    });

    console.log('\n🟨 JAVASCRIPT QUESTIONS:\n');

    jsQuestions.forEach((q, index) => {
      console.log(`Question ${index + 1}:`);
      console.log(`  Type: ${q.type}`);
      console.log(`  Difficulty: ${q.difficultyLevel}`);
      console.log(`  Prompt: ${q.promptText}`);
      if (q.codeSnippet) {
        console.log(`  Code:\n${q.codeSnippet.split('\n').map(line => '    ' + line).join('\n')}`);
      }
      console.log(`  Options:`);
      const options = JSON.parse(JSON.stringify(q.options));
      if (Array.isArray(options)) {
        options.forEach((opt, i) => {
          console.log(`    ${String.fromCharCode(65 + i)}) ${opt}`);
        });
      }
      console.log(`  Correct Answer: Option ${String.fromCharCode(65 + q.correctAnswerIndex)}`);
      console.log(`  Time Limit: ${q.timeLimitSeconds}s`);
      console.log(`  AI Generated: ${q.isAIGenerated}`);
      console.log('');
      console.log('-'.repeat(80));
      console.log('');
    });

    // Get Python questions
    const pythonSkill = await prisma.skill.findFirst({
      where: { name: 'Python' }
    });

    if (pythonSkill) {
      const pythonQuestions = await prisma.question.findMany({
        where: { skillId: pythonSkill.id },
        take: 2,
      });

      console.log('\n🐍 PYTHON QUESTIONS:\n');

      pythonQuestions.forEach((q, index) => {
        console.log(`Question ${index + 1}:`);
        console.log(`  Type: ${q.type}`);
        console.log(`  Difficulty: ${q.difficultyLevel}`);
        console.log(`  Prompt: ${q.promptText}`);
        if (q.codeSnippet) {
          console.log(`  Code:\n${q.codeSnippet.split('\n').map(line => '    ' + line).join('\n')}`);
        }
        console.log(`  Options:`);
        const options = JSON.parse(JSON.stringify(q.options));
        if (Array.isArray(options)) {
          options.forEach((opt, i) => {
            console.log(`    ${String.fromCharCode(65 + i)}) ${opt}`);
          });
        }
        console.log(`  Correct Answer: Option ${String.fromCharCode(65 + q.correctAnswerIndex)}`);
        console.log(`  Time Limit: ${q.timeLimitSeconds}s`);
        console.log('');
        console.log('-'.repeat(80));
        console.log('');
      });
    }

    // Summary
    console.log('\n✅ THESE ARE REAL QUESTIONS FROM YOUR DATABASE');
    console.log('   Not placeholder text like "Mock question N"');
    console.log('   Not fake options like "Option A for QN"');
    console.log('\n💡 WITH MOCK_MODE="false", THE TEST WILL SERVE THESE QUESTIONS\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showRealQuestions();
