import { authenticatedRequest } from '@/supabase/dal';
import { bookBaseSchema, bookSchema } from '@/app/(protected)/books/_types';
import { NextRequest, NextResponse } from 'next/server';

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/books');
    const books = bookSchema.array().parse(data);
    return NextResponse.json(books);
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

    // category_idとratingのundefinedをnullに変換
    const bookData = {
      ...body,
      category_id: body.category_id ?? null,
      rating: body.rating ?? null,
    };

    const data = await authenticatedRequest('/books', {
      method: 'POST',
      body: JSON.stringify({ book: bookData }),
    });
    const book = bookBaseSchema.parse(data);
    return NextResponse.json(book);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
