import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateHybridMatch, calculateSimpleMatch } from '@/lib/matching-hybrid';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Get student profile with skill profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
      include: {
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

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Get student skills
    const studentSkills =
      studentProfile.skillProfile?.entries.map((entry) => ({
        skillId: entry.skillId,
        skillName: entry.skill.name,
        proficiencyLevel: entry.proficiencyLevel,
      })) || [];

    // Get opportunity with full details
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        industryProfile: {
          include: {
            user: true,
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Calculate detailed match using hybrid matching
    const requiredSkills = opportunity.requiredSkills.map((rs) => ({
      skillId: rs.skillId,
      skillName: rs.skill.name,
      minProficiency: rs.minProficiency,
    }));

    let matchResult;
    try {
      matchResult = await calculateHybridMatch(studentSkills, requiredSkills);
    } catch (error) {
      console.warn('Hybrid matching failed, using simple match:', error);
      matchResult = calculateSimpleMatch(studentSkills, requiredSkills);
    }

    return NextResponse.json({
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        description: opportunity.description,
        companyName: opportunity.industryProfile.companyName,
        type: opportunity.type,
        location: opportunity.location,
        isRemote: opportunity.isRemote,
        postedAt: opportunity.postedAt,
        deadline: opportunity.deadline,
        status: opportunity.status,
      },
      match: {
        overallScore: matchResult.overallScore,
        exactMatches: matchResult.exactMatches,
        semanticMatches: matchResult.semanticMatches,
        gapSkills: matchResult.gapSkills,
        breakdown: matchResult.breakdown,
      },
    });
  } catch (error) {
    console.error('Failed to fetch opportunity detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity detail' },
      { status: 500 }
    );
  }
}
