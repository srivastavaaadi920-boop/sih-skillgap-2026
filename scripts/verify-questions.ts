import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🔍 VERIFYING QUESTION BANK\n');
  console.log('='.repeat(80));

  // Total count
  const totalQuestions = await prisma.question.count();
  console.log(`\n📊 Total Questions: ${totalQuestions}\n`);

  // Example 1: JavaScript CODE_OUTPUT_PREDICTION
  console.log('='.repeat(80));
  console.log('\n📝 EXAMPLE 1: Code Output Prediction (JavaScript)\n');
  const jsCodeQuestion = await prisma.question.findFirst({
    where: {
      skill: { name: 'JavaScript' },
      type: 'CODE_OUTPUT_PREDICTION',
    },
    include: { skill: true },
  });

  if (jsCodeQuestion) {
    console.log(`Skill: ${jsCodeQuestion.skill.name}`);
    console.log(`Type: ${jsCodeQuestion.type}`);
    console.log(`Difficulty: ${jsCodeQuestion.difficultyLevel}`);
    console.log(`Time Limit: ${jsCodeQuestion.timeLimitSeconds}s`);
    console.log(`\nPrompt: ${jsCodeQuestion.promptText}\n`);
    console.log(`Code:\n${jsCodeQuestion.codeSnippet}\n`);
    console.log('Options:');
    (jsCodeQuestion.options as string[]).forEach((opt, idx) => {
      const marker = idx === jsCodeQuestion.correctAnswerIndex ? '✓' : ' ';
      console.log(`  [${marker}] ${idx + 1}. ${opt}`);
    });
    console.log(`\nExplanation: ${jsCodeQuestion.explanation}`);
    console.log(`AI Generated: ${jsCodeQuestion.isAIGenerated}`);
  }

  // Example 2: Communication SITUATIONAL_JUDGMENT
  console.log('\n' + '='.repeat(80));
  console.log('\n📝 EXAMPLE 2: Situational Judgment (Communication - Soft Skill)\n');
  const commQuestion = await prisma.question.findFirst({
    where: {
      skill: { name: 'Communication' },
      type: 'SITUATIONAL_JUDGMENT',
      difficultyLevel: 'ADVANCED',
    },
    include: { skill: true },
  });

  if (commQuestion) {
    console.log(`Skill: ${commQuestion.skill.name}`);
    console.log(`Type: ${commQuestion.type}`);
    console.log(`Difficulty: ${commQuestion.difficultyLevel}`);
    console.log(`Time Limit: ${commQuestion.timeLimitSeconds}s`);
    console.log(`\nScenario: ${commQuestion.promptText}\n`);
    console.log('Response Options:');
    (commQuestion.options as string[]).forEach((opt, idx) => {
      const marker = idx === commQuestion.correctAnswerIndex ? '✓' : ' ';
      console.log(`  [${marker}] ${idx + 1}. ${opt}`);
    });
    console.log(`\nBest Response Explanation: ${commQuestion.explanation}`);
    console.log(`AI Generated: ${commQuestion.isAIGenerated}`);
  }

  // Example 3: Python DEBUG_SNIPPET
  console.log('\n' + '='.repeat(80));
  console.log('\n📝 EXAMPLE 3: Debug Snippet (Python)\n');
  const pythonDebugQuestion = await prisma.question.findFirst({
    where: {
      skill: { name: 'Python' },
      type: 'DEBUG_SNIPPET',
    },
    include: { skill: true },
  });

  if (pythonDebugQuestion) {
    console.log(`Skill: ${pythonDebugQuestion.skill.name}`);
    console.log(`Type: ${pythonDebugQuestion.type}`);
    console.log(`Difficulty: ${pythonDebugQuestion.difficultyLevel}`);
    console.log(`Time Limit: ${pythonDebugQuestion.timeLimitSeconds}s`);
    console.log(`\nPrompt: ${pythonDebugQuestion.promptText}\n`);
    console.log(`Buggy Code:\n${pythonDebugQuestion.codeSnippet}\n`);
    console.log('What\'s wrong?');
    (pythonDebugQuestion.options as string[]).forEach((opt, idx) => {
      const marker = idx === pythonDebugQuestion.correctAnswerIndex ? '✓' : ' ';
      console.log(`  [${marker}] ${idx + 1}. ${opt}`);
    });
    console.log(`\nExplanation: ${pythonDebugQuestion.explanation}`);
    console.log(`AI Generated: ${pythonDebugQuestion.isAIGenerated}`);
  }

  // Question type distribution
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 QUESTION TYPE DISTRIBUTION:\n');
  
  const typeDistribution = await prisma.question.groupBy({
    by: ['type'],
    _count: true,
  });

  typeDistribution.forEach(({ type, _count }) => {
    console.log(`   ${type.padEnd(30)} ${_count} questions`);
  });

  // Difficulty distribution
  console.log('\n📊 DIFFICULTY DISTRIBUTION:\n');
  
  const difficultyDistribution = await prisma.question.groupBy({
    by: ['difficultyLevel'],
    _count: true,
  });

  difficultyDistribution.forEach(({ difficultyLevel, _count }) => {
    console.log(`   ${difficultyLevel.padEnd(15)} ${_count} questions`);
  });

  // Skills with most questions
  console.log('\n📊 TOP SKILLS BY QUESTION COUNT:\n');
  
  const skillCounts = await prisma.skill.findMany({
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
    orderBy: {
      questions: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  skillCounts.forEach((skill) => {
    console.log(`   ${skill.name.padEnd(40)} ${skill._count.questions} questions`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Verification Complete!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
