import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSkillsByFieldId } from '@/lib/ayush-mock-data';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('fieldId');

    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Returning skills for field:', fieldId || 'ALL');
      
      if (fieldId) {
        const skills = getSkillsByFieldId(fieldId);
        const technical = skills.filter(s => s.category === 'TECHNICAL');
        const soft = skills.filter(s => s.category === 'SOFT');
        return NextResponse.json({ technical, soft });
      }
      
      // If no fieldId, return empty (should not happen in new flow)
      return NextResponse.json({ technical: [], soft: [] });
    }

    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    if (!fieldId) {
      return NextResponse.json(
        { error: 'fieldId is required' },
        { status: 400 }
      );
    }

    // Fetch skills linked to this field via FieldSkill table
    const fieldSkills = await prisma.fieldSkill.findMany({
      where: { fieldId },
      include: {
        skill: true,
      },
    });

    const skills = fieldSkills.map(fs => fs.skill);
    const technical = skills.filter(s => s.category === 'TECHNICAL');
    const soft = skills.filter(s => s.category === 'SOFT');

    console.log(`📊 Returning ${technical.length} technical + ${soft.length} soft = ${skills.length} total skills for field ${fieldId}`);

    return NextResponse.json({ technical, soft });
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
