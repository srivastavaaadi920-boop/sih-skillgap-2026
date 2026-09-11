import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OpportunityType, OpportunityStatus, Domain } from '@prisma/client';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// GET /api/industry/opportunities - List all opportunities for logged-in industry user
export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'INDUSTRY') {
      return NextResponse.json(
        { error: 'Unauthorized - Industry users only' },
        { status: 403 }
      );
    }

    // MOCK MODE - Return opportunities from client storage
    // Note: In mock mode, opportunities are stored client-side in localStorage
    // This endpoint signals mock mode; client will handle data retrieval
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: GET opportunities - client will use localStorage');
      return NextResponse.json({ 
        opportunities: [],
        useMockStorage: true 
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

    const opportunities = await prisma.opportunity.findMany({
      where: {
        industryProfileId: industryProfile.id,
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
      orderBy: {
        postedAt: 'desc',
      },
    });

    return NextResponse.json({
      opportunities: opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        type: opp.type,
        status: opp.status,
        location: opp.location,
        isRemote: opp.isRemote,
        postedAt: opp.postedAt,
        deadline: opp.deadline,
        applicantCount: opp._count.applications,
        requiredSkillsCount: opp.requiredSkills.length,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

// POST /api/industry/opportunities - Create new opportunity
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'INDUSTRY') {
      return NextResponse.json(
        { error: 'Unauthorized - Industry users only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      location,
      isRemote,
      deadline,
      domain,
      fieldId,
      requiredSkills, // Array of {skillId, minProficiency}
    } = body;

    // Validate required fields
    if (!title || !description || !type || !fieldId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate type
    if (!Object.values(OpportunityType).includes(type)) {
      return NextResponse.json({ error: 'Invalid opportunity type' }, { status: 400 });
    }

    // Validate domain if provided
    if (domain && !Object.values(Domain).includes(domain)) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
    }

    // MOCK MODE - Signal client to store in localStorage
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: POST opportunity - signaling client to store in localStorage');
      console.log('   Title:', title);
      console.log('   Type:', type);
      console.log('   Field:', fieldId);
      console.log('   Required Skills:', requiredSkills?.length || 0);

      // Return the submitted data back with an ID and useMockStorage flag
      // Client will store this in localStorage
      const mockOpportunity = {
        id: `mock-opp-${Date.now()}`,
        title,
        description,
        type,
        location: location || null,
        isRemote: isRemote || false,
        deadline: deadline || null,
        status: 'OPEN',
        domain: domain || null,
        fieldId,
        postedAt: new Date().toISOString(),
        requiredSkills: (requiredSkills || []),
      };

      return NextResponse.json({ 
        opportunity: mockOpportunity,
        useMockStorage: true 
      }, { status: 201 });
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

    // Create opportunity with required skills
    const opportunity = await prisma.opportunity.create({
      data: {
        industryProfileId: industryProfile.id,
        title,
        description,
        type,
        location: location || null,
        isRemote: isRemote || false,
        deadline: deadline ? new Date(deadline) : null,
        status: OpportunityStatus.OPEN,
        requiredSkills: {
          create: (requiredSkills || []).map((skill: any) => ({
            skillId: skill.skillId,
            minProficiency: skill.minProficiency,
          })),
        },
      },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    console.error('Failed to create opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
