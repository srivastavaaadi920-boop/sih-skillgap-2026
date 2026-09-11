import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateMatch, StudentSkill, RequiredSkill } from '@/lib/matching';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// GET /api/industry/opportunities/[id]/candidates - Get matched candidates
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'INDUSTRY') {
      return NextResponse.json(
        { error: 'Unauthorized - Industry users only' },
        { status: 403 }
      );
    }

    // MOCK MODE - Return empty candidates (no applications in mock mode yet)
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: GET candidates - returning empty list');
      console.log('   Opportunity ID:', params.id);
      return NextResponse.json({ candidates: [] });
    }

    const industryProfile = await prisma.industryProfile.findUnique({
      where: { userId: authUser.userId },
    });

    if (!industryProfile) {
      return NextResponse.json(
        { error: 'Industry profile not found' },
        { status: 404 }
      );
    }

    // Verify opportunity ownership and get required skills
    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: params.id,
        industryProfileId: industryProfile.id,
      },
      include: {
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

    // Get all applications for this opportunity
    const applications = await prisma.application.findMany({
      where: {
        opportunityId: params.id,
      },
      include: {
        studentProfile: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            field: {
              select: {
                name: true,
              },
            },
            goal: {
              select: {
                title: true,
              },
            },
            studentSkillSelections: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });

    // Prepare required skills for matching
    const requiredSkills: RequiredSkill[] = opportunity.requiredSkills.map((rs) => ({
      skillId: rs.skillId,
      skillName: rs.skill.name,
      minProficiency: rs.minProficiency,
    }));

    // Calculate match percentage for each candidate
    const candidates = applications.map((app) => {
      // Map student skill selections to matching engine format
      // Convert SkillLevel enum to numeric scale: BEGINNER=2, INTERMEDIATE=3, ADVANCED=4
      const studentSkills: StudentSkill[] =
        app.studentProfile.studentSkillSelections.map((selection) => ({
          skillId: selection.skillId,
          skillName: selection.skill.name,
          proficiencyLevel:
            selection.selfRatedLevel === 'BEGINNER'
              ? 2
              : selection.selfRatedLevel === 'INTERMEDIATE'
              ? 3
              : 4, // ADVANCED
        }));

      // Calculate match using existing matching engine
      const matchResult = calculateMatch(studentSkills, requiredSkills);

      return {
        applicationId: app.id,
        studentId: app.studentProfile.id,
        studentName: app.studentProfile.user.name,
        studentEmail: app.studentProfile.user.email,
        field: app.studentProfile.field?.name || 'Not specified',
        goal: app.studentProfile.goal?.title || 'Not specified',
        matchPercentage: matchResult.overallScore,
        matchedSkills: matchResult.matchedSkills,
        gapSkills: matchResult.gapSkills,
        applicationStatus: app.status,
        appliedAt: app.appliedAt,
      };
    });

    // Sort by match percentage descending
    candidates.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}
