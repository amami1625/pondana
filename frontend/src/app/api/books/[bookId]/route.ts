import { authenticatedRequest } from '@/supabase/dal';
import { bookBaseSchema, bookDetailSchema } from '@/app/(protected)/books/_types';
import { ApiError } from '@/lib/errors/ApiError';
import { NextRequest, NextResponse } from 'next/server';

// エラーメッセージ
const ERROR_MESSAGES = {
  NOT_FOUND: '本の取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

// GET - 詳細取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const data = await authenticatedRequest(`/books/${bookId}`, {}, false);
    const book = bookDetailSchema.parse(data);
    return NextResponse.json(book);
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

// PUT - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const body = await request.json();

    // category_idとratingのundefinedをnullに変換
    const bookData = {
      ...body,
      category_id: body.category_id ?? null,
      rating: body.rating ?? null,
    };

    const data = await authenticatedRequest(
      `/books/${bookId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ book: bookData }),
      },
      false, // API Routeでは404をApiErrorとしてスロー
    );
    const book = bookBaseSchema.parse(data);
    return NextResponse.json(book);
  } catch (error) {
    // ApiErrorの場合はステータスコードとエラーコードを保持
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// DELETE - 削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    await authenticatedRequest(
      `/books/${bookId}`,
      {
        method: 'DELETE',
      },
      false, // API Routeでは404をApiErrorとしてスロー
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    // ApiErrorの場合はステータスコードとエラーコードを保持
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
