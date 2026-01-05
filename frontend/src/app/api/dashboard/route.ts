import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { dashboardSchema } from '@/schemas/dashboard';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await authenticatedRequest('/dashboard', {}, false);
    console.log('Dashboard API - Received data:', JSON.stringify(data, null, 2));

    const dashboard = dashboardSchema.parse(data);
    console.log('Dashboard API - Parsed successfully');
    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Dashboard API - Error:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    if (error instanceof Error) {
      console.error('Dashboard API - Error details:', error.message, error.stack);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
