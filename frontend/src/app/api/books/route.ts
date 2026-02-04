import { authenticatedRequest } from '@/supabase/dal';
import { bookBaseSchema, bookSchema } from '@/app/(protected)/books/_types';
import { handleRouteError } from '@/lib/api/handleRouteError';
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
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
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
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.CREATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
