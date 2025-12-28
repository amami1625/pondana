import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { listBookSchema } from '@/schemas/listBooks';
import { NextRequest, NextResponse } from 'next/server';

// POST - リストに本を追加
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await authenticatedRequest(
      '/list_books',
      {
        method: 'POST',
        body: JSON.stringify({ list_book: body }),
      },
      false,
    );

    const listBook = listBookSchema.parse(data);
    return NextResponse.json(listBook, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
