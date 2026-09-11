import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateHybridMatch, calculateSimpleMatch } from '@/lib/matching-hybrid';

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

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

    // Get all open opportunities with required skills
    const opportunities = await prisma.opportunity.findMany({
      where: { status: 'OPEN' },
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
      orderBy: { postedAt: 'desc' },
    });

    // Calculate match score for each opportunity using hybrid matching
    const opportunitiesWithScores = await Promise.all(
      opportunities.map(async (opp) => {
        const requiredSkills = opp.requiredSkills.map((rs) => ({
          skillId: rs.skillId,
          skillName: rs.skill.name,
          minProficiency: rs.minProficiency,
        }));

        // Use hybrid matching (with semantic similarity)
        let matchResult;
        try {
          matchResult = await calculateHybridMatch(studentSkills, requiredSkills);
        } catch (error) {
          // Fallback to simple matching if hybrid fails
          console.warn('Hybrid matching failed, using simple match:', error);
          matchResult = calculateSimpleMatch(studentSkills, requiredSkills);
        }

        return {
          id: opp.id,
          title: opp.title,
          companyName: opp.industryProfile.companyName,
          type: opp.type,
          location: opp.location,
          isRemote: opp.isRemote,
          postedAt: opp.postedAt,
          deadline: opp.deadline,
          matchScore: matchResult.overallScore,
          breakdown: matchResult.breakdown,
        };
      })
    );

    // Sort by match score descending (highest match first)
    opportunitiesWithScores.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ opportunities: opportunitiesWithScores });
  } catch (error) {
    console.error('Failed to fetch opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
