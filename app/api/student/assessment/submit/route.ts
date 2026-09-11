import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

interface SkillScore {
  skillId: string;
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Assessment submission started');
    
    const authUser = await getAuthUser();
    console.log('👤 Auth user:', authUser ? `${authUser.email} (${authUser.role})` : 'null');

    if (!authUser || authUser.role !== 'STUDENT') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { scores } = body as { scores: SkillScore[] };
    console.log('📊 Received scores:', scores?.length || 0, 'skills');

    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      console.log('❌ Invalid scores data');
      return NextResponse.json(
        { error: 'Scores array is required' },
        { status: 400 }
      );
    }

    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating assessment submission');
      return NextResponse.json({
        message: 'Assessment submitted successfully (mock mode)',
        assessmentId: 'mock_assessment_' + Date.now(),
      });
    }

    console.log('🔍 Looking up student profile for userId:', authUser.userId);
    
    // Find student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
    });

    if (!studentProfile) {
      console.log('❌ Student profile not found for userId:', authUser.userId);
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    console.log('✅ Student profile found:', studentProfile.id);
    console.log('💾 Starting database transaction...');

    // Create assessment and update skill profile in a transaction
    // Increased timeout to 60 seconds for slow network connections
    const result = await prisma.$transaction(async (tx) => {
      // Create skill assessment
      const assessment = await tx.skillAssessment.create({
        data: {
          studentProfileId: studentProfile.id,
          submittedAt: new Date(),
        },
      });

      // Create assessment answers
      for (const { skillId, score } of scores) {
        await tx.skillAssessmentAnswer.create({
          data: {
            skillAssessmentId: assessment.id,
            skillId,
            score,
          },
        });
      }

      // Find or create skill profile
      let skillProfile = await tx.skillProfile.findUnique({
        where: { studentProfileId: studentProfile.id },
      });

      if (!skillProfile) {
        skillProfile = await tx.skillProfile.create({
          data: {
            studentProfileId: studentProfile.id,
          },
        });
      }

      // Delete existing skill profile entries
      await tx.skillProfileEntry.deleteMany({
        where: { skillProfileId: skillProfile.id },
      });

      // Create new skill profile entries
      for (const { skillId, score } of scores) {
        await tx.skillProfileEntry.create({
          data: {
            skillProfileId: skillProfile.id,
            skillId,
            proficiencyLevel: score,
          },
        });
      }

      return assessment;
    }, {
      maxWait: 60000, // Maximum wait time: 60 seconds
      timeout: 60000,  // Transaction timeout: 60 seconds
    });

    console.log('✅ Assessment submitted successfully! ID:', result.id);

    return NextResponse.json({
      message: 'Assessment submitted successfully',
      assessmentId: result.id,
    });
  } catch (error) {
    console.error('💥 Assessment submission failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to submit assessment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
