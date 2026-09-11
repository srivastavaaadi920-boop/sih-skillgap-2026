import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    // Check if this is a mock user - if so, frontend will use localStorage
    if (authUser.userId.startsWith('mock_')) {
      console.log('🔧 MOCK MODE: Client should use localStorage for onboarding data');
      return NextResponse.json({
        useMockStorage: true,
        message: 'Use localStorage for mock mode',
      });
    }

    // REAL MODE - Fetch from database
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
      include: {
        field: true,
        goal: true,
        studentSkillSelections: {
          include: {
            skill: true,
          },
        },
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

    const completed = !!(studentProfile.fieldId && studentProfile.goalId && studentProfile.studentSkillSelections.length > 0);

    // Build skills list with verified status
    const skills = studentProfile.studentSkillSelections.map(selection => {
      const skillProfileEntry = studentProfile.skillProfile?.entries.find(
        e => e.skillId === selection.skillId
      );

      return {
        skillId: selection.skillId,
        skillName: selection.skill.name,
        skillCategory: selection.skill.category,
        selfRatedLevel: selection.selfRatedLevel,
        verifiedLevel: skillProfileEntry?.verifiedLevel,
        isVerified: skillProfileEntry?.isVerified || false,
      };
    });

    return NextResponse.json({
      completed,
      fieldId: studentProfile.fieldId,
      goalId: studentProfile.goalId,
      fieldName: studentProfile.field?.name,
      goalTitle: studentProfile.goal?.title,
      skills,
      useMockStorage: false,
    });
  } catch (error) {
    console.error('Failed to fetch onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
