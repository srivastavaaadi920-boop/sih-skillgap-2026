import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface SkillSelection {
  skillId: string;
  level: SkillLevel;
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fieldId, goalId, skills } = body as {
      fieldId: string;
      goalId: string;
      skills: SkillSelection[];
    };

    if (!fieldId || !goalId || !skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'Field, goal, and skills are required' },
        { status: 400 }
      );
    }

    // MOCK MODE - Simulate success without database
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating onboarding submission');
      console.log(`   Field: ${fieldId}`);
      console.log(`   Goal: ${goalId}`);
      console.log(`   Skills: ${skills.length}`);
      
      return NextResponse.json({
        message: 'Onboarding completed successfully (mock mode)',
        skillsSelected: skills.length,
        mockMode: true,
      });
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Update student profile and skill selections in a transaction
    await prisma.$transaction(async (tx) => {
      // Update field and goal
      await tx.studentProfile.update({
        where: { id: studentProfile.id },
        data: {
          fieldId,
          goalId,
          updatedAt: new Date(),
        },
      });

      // Delete existing skill selections
      await tx.studentSkillSelection.deleteMany({
        where: { studentProfileId: studentProfile.id },
      });

      // Create new skill selections
      for (const { skillId, level } of skills) {
        await tx.studentSkillSelection.create({
          data: {
            studentProfileId: studentProfile.id,
            skillId,
            selfRatedLevel: level,
          },
        });
      }

      // Also update/create SkillProfile with these selections (for matching system)
      // Map skill level to proficiency: BEGINNER=2, INTERMEDIATE=3, ADVANCED=4
      const levelToProficiency: Record<SkillLevel, number> = {
        BEGINNER: 2,
        INTERMEDIATE: 3,
        ADVANCED: 4,
      };

      // Find or create skill profile
      let skillProfile = await tx.skillProfile.findUnique({
        where: { studentProfileId: studentProfile.id },
      });

      if (!skillProfile) {
        skillProfile = await tx.skillProfile.create({
          data: { studentProfileId: studentProfile.id },
        });
      }

      // Delete existing skill profile entries
      await tx.skillProfileEntry.deleteMany({
        where: { skillProfileId: skillProfile.id },
      });

      // Create new skill profile entries
      for (const { skillId, level } of skills) {
        await tx.skillProfileEntry.create({
          data: {
            skillProfileId: skillProfile.id,
            skillId,
            proficiencyLevel: levelToProficiency[level],
            isVerified: false, // Not yet verified by test
            verifiedLevel: null,
          },
        });
      }
    }, {
      maxWait: 60000,
      timeout: 60000,
    });

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      skillsSelected: skills.length,
    });
  } catch (error) {
    console.error('Onboarding submission failed:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
