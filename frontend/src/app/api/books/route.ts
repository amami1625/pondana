import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { bookBaseSchema, bookSchema } from '@/app/(protected)/books/_types';
import { NextRequest, NextResponse } from 'next/server';

// エラーメッセージ
const ERROR_MESSAGES = {
  NOT_FOUND: '本の取得に失敗しました',
  CREATE_FAILED: '本の作成に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/books', {}, false);
    const books = bookSchema.array().parse(data);
    return NextResponse.json(books);
  } catch (error) {
    if (error instanceof ApiError) {
      const message =
        error.statusCode === 404 ? ERROR_MESSAGES.NOT_FOUND : ERROR_MESSAGES.UNKNOWN;
      return NextResponse.json({ error: message }, { status: error.statusCode });
    }
    if (error instanceof TypeError) {
      return NextResponse.json({ error: ERROR_MESSAGES.NETWORK_ERROR }, { status: 503 });
    }
    return NextResponse.json({ error: ERROR_MESSAGES.UNKNOWN }, { status: 500 });
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
    if (error instanceof ApiError) {
      return NextResponse.json({ error: ERROR_MESSAGES.CREATE_FAILED }, { status: error.statusCode });
    }
    if (error instanceof TypeError) {
      return NextResponse.json({ error: ERROR_MESSAGES.NETWORK_ERROR }, { status: 503 });
    }
    return NextResponse.json({ error: ERROR_MESSAGES.UNKNOWN }, { status: 500 });
  }
}
