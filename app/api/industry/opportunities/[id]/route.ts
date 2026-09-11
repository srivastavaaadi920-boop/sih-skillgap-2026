import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OpportunityStatus } from '@prisma/client';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// GET /api/industry/opportunities/[id] - Get opportunity detail
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

    // MOCK MODE - Signal client to use localStorage
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: GET opportunity detail - client will use localStorage');
      console.log('   Opportunity ID:', params.id);
      
      // Return signal for client to use localStorage
      return NextResponse.json({ 
        useMockStorage: true,
        opportunityId: params.id
      });
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

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: params.id,
        industryProfileId: industryProfile.id, // Ensure they own this opportunity
      },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        _count: {
          select: {
            applications: true,
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

    return NextResponse.json({
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        description: opportunity.description,
        type: opportunity.type,
        status: opportunity.status,
        location: opportunity.location,
        isRemote: opportunity.isRemote,
        postedAt: opportunity.postedAt,
        deadline: opportunity.deadline,
        applicantCount: opportunity._count.applications,
        requiredSkills: opportunity.requiredSkills.map((rs) => ({
          skillId: rs.skillId,
          skillName: rs.skill.name,
          minProficiency: rs.minProficiency,
        })),
      },
    });
  } catch (error) {
    console.error('Failed to fetch opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PATCH /api/industry/opportunities/[id] - Update opportunity
export async function PATCH(
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

    const body = await request.json();
    const { title, description, status, deadline, location, isRemote } = body;

    // MOCK MODE - Signal client to update localStorage
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: PATCH opportunity - client will update localStorage');
      console.log('   Opportunity ID:', params.id);
      console.log('   Updates:', Object.keys(body));

      // Validate status if provided
      if (status && !Object.values(OpportunityStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true,
        updates: body,
        useMockStorage: true,
        opportunityId: params.id
      });
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

    // Verify ownership
    const existing = await prisma.opportunity.findFirst({
      where: {
        id: params.id,
        industryProfileId: industryProfile.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Validate status if provided
    if (status && !Object.values(OpportunityStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.opportunity.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(location !== undefined && { location }),
        ...(isRemote !== undefined && { isRemote }),
      },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return NextResponse.json({ opportunity: updated });
  } catch (error) {
    console.error('Failed to update opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}
