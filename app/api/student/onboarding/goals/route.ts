import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getGoalsByFieldId } from '@/lib/ayush-mock-data';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');

    if (!fieldId) {
      return NextResponse.json(
        { error: 'fieldId is required' },
        { status: 400 }
      );
    }

    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Returning goals for field:', fieldId);
      const goals = getGoalsByFieldId(fieldId);
      return NextResponse.json({ goals });
    }

    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    const goals = await prisma.goal.findMany({
      where: { fieldId },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}
