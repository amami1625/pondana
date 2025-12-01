import { authenticatedRequest } from '@/supabase/dal';
import { tagSchema } from '@/app/(protected)/tags/_types';
import { NextRequest, NextResponse } from 'next/server';

// PUT - 更新
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = await authenticatedRequest(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ tag: body }),
    });
    const tag = tagSchema.parse(data);
    return NextResponse.json(tag);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
