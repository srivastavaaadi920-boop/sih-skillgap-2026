import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugMatching() {
  console.log('\n🔍 DEBUGGING MATCHING ENGINE\n');
  console.log('=' .repeat(80));

  // 1. Check OpportunitySkill records
  console.log('\n1️⃣ Checking OpportunitySkill records per opportunity:\n');
  
  const opportunities = await prisma.opportunity.findMany({
    include: {
      requiredSkills: {
        include: {
          skill: true,
        },
      },
      industryProfile: {
        include: {
          user: true,
        },
      },
    },
  });

  console.log(`Total opportunities: ${opportunities.length}\n`);

  for (const opp of opportunities) {
    console.log(`📋 ${opp.title} (${opp.type})`);
    console.log(`   Company: ${opp.industryProfile.companyName}`);
    console.log(`   Required skills: ${opp.requiredSkills.length}`);
    
    if (opp.requiredSkills.length === 0) {
      console.log('   ⚠️  WARNING: NO REQUIRED SKILLS FOUND!');
    } else {
      opp.requiredSkills.forEach(rs => {
        console.log(`      - ${rs.skill.name} (min proficiency: ${rs.minProficiency})`);
      });
    }
    console.log('');
  }

  // 2. Check student skill profiles
  console.log('\n2️⃣ Checking Student Skill Profiles:\n');
  
  const students = await prisma.studentProfile.findMany({
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

  console.log(`Total students: ${students.length}\n`);

  for (const student of students) {
    console.log(`👤 ${student.user.name} (${student.user.email})`);
    
    if (!student.skillProfile) {
      console.log('   ⚠️  No skill profile found');
    } else {
      console.log(`   Total skills rated: ${student.skillProfile.entries.length}`);
      
      if (student.skillProfile.entries.length > 0) {
        console.log('   Top 5 skills:');
        const topSkills = student.skillProfile.entries
          .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
          .slice(0, 5);
        
        topSkills.forEach(entry => {
          console.log(`      - ${entry.skill.name}: ${entry.proficiencyLevel}/5`);
        });
      }
    }
    console.log('');
  }

  // 3. Test matching logic edge cases
  console.log('\n3️⃣ Testing Matching Logic Edge Cases:\n');
  
  // Test with empty required skills
  const emptyRequired: any[] = [];
  console.log('Test case: Empty required skills array');
  console.log(`   Expected: 0% or undefined, NOT 100%`);
  console.log(`   Actual calculation: ${emptyRequired.length === 0 ? 'Would divide by 0!' : 'OK'}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Debug complete\n');

  await prisma.$disconnect();
}

debugMatching().catch(console.error);
