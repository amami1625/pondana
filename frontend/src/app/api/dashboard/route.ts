import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { dashboardSchema } from '@/schemas/dashboard';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await authenticatedRequest('/dashboard', {}, false);

    const dashboard = dashboardSchema.parse(data);
    return NextResponse.json(dashboard);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
