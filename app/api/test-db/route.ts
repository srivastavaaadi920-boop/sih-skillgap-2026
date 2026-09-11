import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Simple query
    const skillCount = await prisma.skill.count();
    console.log(`✅ Skills in database: ${skillCount}`);

    // Test 2: Check opportunities
    const oppCount = await prisma.opportunity.count();
    console.log(`✅ Opportunities in database: ${oppCount}`);

    // Test 3: Check OpportunitySkill records
    const oppSkillCount = await prisma.opportunitySkill.count();
    console.log(`✅ OpportunitySkill records: ${oppSkillCount}`);

    // Test 4: Sample opportunity with skills
    const sampleOpp = await prisma.opportunity.findFirst({
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      database: 'Connected',
      stats: {
        skills: skillCount,
        opportunities: oppCount,
        opportunitySkills: oppSkillCount,
      },
      sampleOpportunity: sampleOpp ? {
        title: sampleOpp.title,
        requiredSkillsCount: sampleOpp.requiredSkills.length,
        requiredSkills: sampleOpp.requiredSkills.map(rs => ({
          skillName: rs.skill.name,
          minProficiency: rs.minProficiency,
        })),
      } : null,
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
