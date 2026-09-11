import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getFieldsByDomain } from '@/lib/ayush-mock-data';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function GET(request: NextRequest) {
  try {
    // Get domain from query parameter  
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') as 'TECHNOLOGY' | 'AYUSH' | null;

    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Returning fields for domain:', domain || 'ALL');
      
      if (domain) {
        const fields = getFieldsByDomain(domain);
        return NextResponse.json({ fields });
      }
      
      // Return all fields if no domain specified
      const allFields = [
        ...getFieldsByDomain('TECHNOLOGY'),
        ...getFieldsByDomain('AYUSH'),
      ];
      return NextResponse.json({ fields: allFields });
    }

    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    // Fetch fields from database, optionally filtered by domain
    const fields = await prisma.field.findMany({
      where: domain ? { domain } : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Failed to fetch fields:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    );
  }
}
