import { authenticatedRequest } from '@/supabase/dal';
import { listSchema } from '@/schemas/list';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET - ユーザーの公開リスト一覧取得
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}/lists`);
    const lists = z.array(listSchema).parse(data);
    return NextResponse.json(lists);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
