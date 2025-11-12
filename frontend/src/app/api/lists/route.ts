import { authenticatedRequest } from '@/supabase/dal';
import { listBaseSchema, listSchema } from '@/app/(protected)/lists/_types';
import { NextRequest, NextResponse } from 'next/server';

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/lists');
    const lists = listSchema.array().parse(data);
    return NextResponse.json(lists);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// POST - 作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: 将来的にzodのスキーマで変換を行うように変更する
    const listData = {
      ...body,
      description: body.description?.trim() || null,
    };

    const data = await authenticatedRequest('/lists', {
      method: 'POST',
      body: JSON.stringify({ list: listData }),
    });
    const list = listBaseSchema.parse(data);
    return NextResponse.json(list);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
