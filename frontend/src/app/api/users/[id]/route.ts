import { authenticatedRequest } from '@/supabase/dal';
import { userWithStatsSchema } from '@/schemas/user';
import { NextRequest, NextResponse } from 'next/server';

// GET - ユーザー情報取得
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}`);
    const user = userWithStatsSchema.parse(data);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
