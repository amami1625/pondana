import { authenticatedRequest } from '@/supabase/dal';
import { tagSchema } from '@/app/(protected)/tags/_types';
import { NextResponse } from 'next/server';

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/tags');
    const tags = tagSchema.array().parse(data);
    return NextResponse.json(tags);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
