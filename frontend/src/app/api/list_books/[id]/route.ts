import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { NextRequest, NextResponse } from 'next/server';

// DELETE - リストから本を削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await authenticatedRequest(`/list_books/${id}`, {
      method: 'DELETE',
    }, false);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
