import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response = {
    status: 'ok',
    message: 'Backend API is running',
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
    },
    note: 'Database connection will be tested once Supabase connectivity is confirmed',
  };

  return NextResponse.json(response, { status: 200 });
}
