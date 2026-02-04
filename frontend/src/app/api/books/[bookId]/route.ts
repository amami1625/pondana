import { authenticatedRequest } from '@/supabase/dal';
import { bookBaseSchema, bookDetailSchema } from '@/app/(protected)/books/_types';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { NextRequest, NextResponse } from 'next/server';

// エラーメッセージ
const ERROR_MESSAGES = {
  NOT_FOUND: '本の取得に失敗しました',
  UPDATE_FAILED: '本の更新に失敗しました',
  DELETE_FAILED: '本の削除に失敗しました',
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
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
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
      false,
    );
    const book = bookBaseSchema.parse(data);
    return NextResponse.json(book);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.UPDATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
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
      false,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.DELETE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
