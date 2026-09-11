import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@prisma/client';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

// PATCH /api/industry/applications/[id] - Update application status
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
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // MOCK MODE - Signal client to update localStorage
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: PATCH application status - client will update localStorage');
      console.log('   Application ID:', params.id);
      console.log('   New Status:', status);

      return NextResponse.json({ 
        success: true,
        useMockStorage: true,
        applicationId: params.id,
        status
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

    // Verify the application belongs to one of their opportunities
    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        opportunity: {
          industryProfileId: industryProfile.id,
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
