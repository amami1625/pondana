import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { bookSchema } from '@/schemas/book';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET - ユーザーの公開本一覧取得
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}/books`, {}, false);
    const books = z.array(bookSchema).parse(data);
    return NextResponse.json(books);
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
