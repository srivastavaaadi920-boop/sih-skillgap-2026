import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseState() {
  console.log('🔍 Checking current database state...\n');
  console.log('='.repeat(80));
  
  try {
    // Count Fields by domain
    const techFields = await prisma.field.count({ where: { domain: 'TECHNOLOGY' } });
    const ayushFields = await prisma.field.count({ where: { domain: 'AYUSH' } });
    const totalFields = await prisma.field.count();
    
    console.log('\n📊 FIELDS SUMMARY:');
    console.log(`   Technology Fields: ${techFields}`);
    console.log(`   AYUSH Fields: ${ayushFields}`);
    console.log(`   Total Fields: ${totalFields}`);
    
    // List all AYUSH fields
    const ayushFieldsList = await prisma.field.findMany({
      where: { domain: 'AYUSH' },
      orderBy: { name: 'asc' }
    });
    
    console.log('\n📋 AYUSH Fields:');
    ayushFieldsList.forEach((field, index) => {
      console.log(`   ${index + 1}. ${field.name}`);
    });
    
    // Count Goals per AYUSH field
    console.log('\n🎯 GOALS PER AYUSH FIELD:');
    for (const field of ayushFieldsList) {
      const goalCount = await prisma.goal.count({ where: { fieldId: field.id } });
      const goals = await prisma.goal.findMany({
        where: { fieldId: field.id },
        select: { title: true }
      });
      console.log(`   ${field.name}: ${goalCount} goals`);
      if (goalCount === 0) {
        console.log(`      ⚠️  NO GOALS FOUND!`);
      } else {
        goals.forEach(g => console.log(`      • ${g.title}`));
      }
    }
    
    // Count Skills per AYUSH field via FieldSkill
    console.log('\n🎯 SKILLS PER AYUSH FIELD (via FieldSkill):');
    const fieldSkillSummary: Array<{field: string, count: number, expected: number}> = [];
    
    for (const field of ayushFieldsList) {
      const skillCount = await prisma.fieldSkill.count({ where: { fieldId: field.id } });
      const skills = await prisma.fieldSkill.findMany({
        where: { fieldId: field.id },
        include: { skill: { select: { name: true } } }
      });
      
      fieldSkillSummary.push({
        field: field.name,
        count: skillCount,
        expected: 9
      });
      
      console.log(`   ${field.name}: ${skillCount} skills (expected: ~9)`);
      if (skillCount < 9) {
        console.log(`      ⚠️  INCOMPLETE! Expected ~9 skills`);
      }
      if (skillCount > 0 && skillCount <= 15) {
        skills.forEach(s => console.log(`      • ${s.skill.name}`));
      }
    }
    
    // Special check for Homoeopathy Practice
    console.log('\n🔍 DETAILED CHECK: Homoeopathy Practice');
    const homoeopathyField = await prisma.field.findFirst({
      where: { name: 'Homoeopathy Practice' }
    });
    
    if (homoeopathyField) {
      const homoeopathySkills = await prisma.fieldSkill.findMany({
        where: { fieldId: homoeopathyField.id },
        include: { skill: { select: { name: true, category: true } } }
      });
      
      console.log(`   Found ${homoeopathySkills.length} skills:`);
      homoeopathySkills.forEach((fs, i) => {
        console.log(`      ${i + 1}. ${fs.skill.name} (${fs.skill.category})`);
      });
      
      const expectedSkills = [
        'Repertorization',
        'Materia Medica Knowledge',
        'Miasmatic Analysis',
        'Homoeopathic Case Taking',
        'Potentization Techniques',
        'Organon of Medicine Application',
        'Constitutional Prescribing',
        'Detailed Patient Interviewing',
        'Analytical Case Reasoning'
      ];
      
      console.log(`\n   Expected 9 skills:`);
      expectedSkills.forEach((skill, i) => {
        const found = homoeopathySkills.some(fs => fs.skill.name === skill);
        console.log(`      ${i + 1}. ${skill} ${found ? '✅' : '❌ MISSING'}`);
      });
    } else {
      console.log('   ❌ Homoeopathy Practice field NOT FOUND!');
    }
    
    // Total counts
    console.log('\n📊 OVERALL SUMMARY:');
    const totalGoals = await prisma.goal.count();
    const totalSkills = await prisma.skill.count();
    const totalFieldSkills = await prisma.fieldSkill.count();
    const customSkills = await prisma.skill.count({ where: { isCustom: true } });
    
    console.log(`   Total Fields: ${totalFields}`);
    console.log(`   Total Goals: ${totalGoals}`);
    console.log(`   Total Skills: ${totalSkills}`);
    console.log(`   Custom Skills: ${customSkills}`);
    console.log(`   Total FieldSkill Mappings: ${totalFieldSkills}`);
    
    // Summary table
    console.log('\n📋 SKILL COUNT COMPARISON TABLE:');
    console.log('   ' + '-'.repeat(70));
    console.log('   Field Name                                  | Actual | Expected');
    console.log('   ' + '-'.repeat(70));
    fieldSkillSummary.forEach(item => {
      const name = item.field.padEnd(43);
      const actual = item.count.toString().padStart(6);
      const expected = item.expected.toString().padStart(8);
      const status = item.count >= item.expected ? '✅' : '❌';
      console.log(`   ${name} | ${actual} | ${expected} ${status}`);
    });
    console.log('   ' + '-'.repeat(70));
    
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseState();
