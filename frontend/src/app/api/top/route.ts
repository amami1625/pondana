import { authenticatedRequest } from '@/supabase/dal';
import { topPageSchema } from '@/schemas/top';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await authenticatedRequest('/top');
    const topPageData = topPageSchema.parse(data);
    return NextResponse.json(topPageData);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
