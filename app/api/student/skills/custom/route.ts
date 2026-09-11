import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// In-memory storage for mock custom skills
const MOCK_CUSTOM_SKILLS: Record<string, Array<{ id: string; name: string; category: 'TECHNICAL' | 'SOFT' }>> = {};

export async function POST(request: NextRequest) {
  try {
    const { fieldId, skillName, category } = await request.json();

    if (!fieldId || !skillName || !category) {
      return NextResponse.json(
        { error: 'fieldId, skillName, and category are required' },
        { status: 400 }
      );
    }

    const trimmedName = skillName.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Skill name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!['TECHNICAL', 'SOFT'].includes(category)) {
      return NextResponse.json(
        { error: 'Category must be TECHNICAL or SOFT' },
        { status: 400 }
      );
    }

    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Adding custom skill:', trimmedName);
      
      // Initialize array if doesn't exist
      if (!MOCK_CUSTOM_SKILLS[fieldId]) {
        MOCK_CUSTOM_SKILLS[fieldId] = [];
      }

      // Check if already exists (case-insensitive)
      const existing = MOCK_CUSTOM_SKILLS[fieldId].find(
        s => s.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existing) {
        return NextResponse.json({ 
          skill: existing,
          message: 'Skill already exists'
        });
      }

      // Add new custom skill
      const newSkill = {
        id: `custom-skill-${Date.now()}`,
        name: trimmedName,
        category: category as 'TECHNICAL' | 'SOFT',
      };

      MOCK_CUSTOM_SKILLS[fieldId].push(newSkill);

      return NextResponse.json({ 
        skill: newSkill,
        message: 'Custom skill added successfully'
      });
    }

    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    // Check if skill already exists (case-insensitive)
    let skill = await prisma.skill.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive',
        },
      },
    });

    if (skill) {
      console.log(`✓ Using existing skill: ${skill.name}`);
    } else {
      // Create new custom skill
      skill = await prisma.skill.create({
        data: {
          name: trimmedName,
          category,
          isCustom: true,
        },
      });
      console.log(`✓ Created new custom skill: ${skill.name}`);
    }

    // Create FieldSkill link if it doesn't exist
    const existingLink = await prisma.fieldSkill.findUnique({
      where: {
        fieldId_skillId: {
          fieldId,
          skillId: skill.id,
        },
      },
    });

    if (!existingLink) {
      await prisma.fieldSkill.create({
        data: {
          fieldId,
          skillId: skill.id,
        },
      });
      console.log(`✓ Linked skill "${skill.name}" to field ${fieldId}`);
    }

    return NextResponse.json({ 
      skill,
      message: 'Custom skill added successfully'
    });
  } catch (error) {
    console.error('Failed to add custom skill:', error);
    return NextResponse.json(
      { error: 'Failed to add custom skill' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve custom skills for a field
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
      const customSkills = MOCK_CUSTOM_SKILLS[fieldId] || [];
      return NextResponse.json({ customSkills });
    }

    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    // Get custom skills linked to this field
    const fieldSkills = await prisma.fieldSkill.findMany({
      where: {
        fieldId,
        skill: {
          isCustom: true,
        },
      },
      include: {
        skill: true,
      },
    });

    const customSkills = fieldSkills.map(fs => fs.skill);

    return NextResponse.json({ customSkills });
  } catch (error) {
    console.error('Failed to fetch custom skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom skills' },
      { status: 500 }
    );
  }
}
