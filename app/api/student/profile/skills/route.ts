import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    if (MOCK_MODE) {
      // Mock skill profile data
      return NextResponse.json({
        hasProfile: true,
        technical: [
          { skillName: 'JavaScript', proficiencyLevel: 4 },
          { skillName: 'Python', proficiencyLevel: 3 },
          { skillName: 'React', proficiencyLevel: 5 },
        ],
        soft: [
          { skillName: 'Communication', proficiencyLevel: 4 },
          { skillName: 'Teamwork', proficiencyLevel: 5 },
        ],
      });
    }

    // Find student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
      include: {
        skillProfile: {
          include: {
            entries: {
              include: {
                skill: true,
              },
              orderBy: {
                proficiencyLevel: 'desc',
              },
            },
          },
        },
      },
    });

    if (!studentProfile || !studentProfile.skillProfile) {
      return NextResponse.json({ hasProfile: false });
    }

    // Group entries by category
    const technical = studentProfile.skillProfile.entries
      .filter((entry) => entry.skill.category === 'TECHNICAL')
      .map((entry) => ({
        skillName: entry.skill.name,
        proficiencyLevel: entry.proficiencyLevel,
      }));

    const soft = studentProfile.skillProfile.entries
      .filter((entry) => entry.skill.category === 'SOFT')
      .map((entry) => ({
        skillName: entry.skill.name,
        proficiencyLevel: entry.proficiencyLevel,
      }));

    return NextResponse.json({
      hasProfile: true,
      technical,
      soft,
    });
  } catch (error) {
    console.error('Failed to fetch skill profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill profile' },
      { status: 500 }
    );
  }
}
