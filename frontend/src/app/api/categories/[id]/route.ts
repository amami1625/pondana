import { authenticatedRequest } from '@/supabase/dal';
import { categorySchema } from '@/app/(protected)/categories/_types';
import { NextRequest, NextResponse } from 'next/server';

// PUT - 更新
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = await authenticatedRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ category: body }),
    });
    const category = categorySchema.parse(data);
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// DELETE - 削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await authenticatedRequest(`/categories/${id}`, {
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
