import { authenticatedRequest } from '@/supabase/dal';
import { listSchema, listDetailSchema } from '@/app/(protected)/lists/_types';
import { NextRequest, NextResponse } from 'next/server';

// GET - 詳細取得
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await authenticatedRequest(`/lists/${params.id}`);
    const list = listDetailSchema.parse(data);
    return NextResponse.json(list);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// PUT - 更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const data = await authenticatedRequest(`/lists/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify({ list: body }),
    });
    const list = listSchema.parse(data);
    return NextResponse.json(list);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// DELETE - 削除
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticatedRequest(`/lists/${params.id}`, {
      method: 'DELETE',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
