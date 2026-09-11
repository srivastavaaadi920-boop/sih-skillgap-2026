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

    // Check if this is a mock user - tell frontend to use localStorage
    if (authUser.userId.startsWith('mock_')) {
      console.log('🔧 MOCK USER DETECTED: Frontend should use localStorage');
      return NextResponse.json({
        useMockStorage: true,
      });
    }

    // REAL MODE - Get student profile with field, goal, and skills
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
      },
    });

    if (!studentProfile || !studentProfile.field || !studentProfile.goal) {
      return NextResponse.json(null);
    }

    // Group skills by category
    const technical = studentProfile.studentSkillSelections
      .filter((selection) => selection.skill.category === 'TECHNICAL')
      .map((selection) => ({
        skillId: selection.skillId,
        skillName: selection.skill.name,
        category: selection.skill.category,
        selfRatedLevel: selection.selfRatedLevel,
        isVerified: false,
      }));

    const soft = studentProfile.studentSkillSelections
      .filter((selection) => selection.skill.category === 'SOFT')
      .map((selection) => ({
        skillId: selection.skillId,
        skillName: selection.skill.name,
        category: selection.skill.category,
        selfRatedLevel: selection.selfRatedLevel,
        isVerified: false,
      }));

    return NextResponse.json({
      domain: studentProfile.selectedDomain,
      fieldName: studentProfile.field.name,
      goalTitle: studentProfile.goal.title,
      skills: {
        technical,
        soft,
      },
      useMockStorage: false,
    });
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
