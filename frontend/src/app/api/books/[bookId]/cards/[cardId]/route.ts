import { NextRequest, NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { cardFormSchema, cardSchema } from '@/app/(protected)/cards/_types';

const ERROR_MESSAGES = {
  UPDATE_FAILED: 'カードの更新に失敗しました',
  DELETE_FAILED: 'カードの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string; cardId: string }> },
) {
  try {
    const { bookId, cardId } = await params;
    const body = await request.json();
    const validatedData = cardFormSchema.parse(body);

    const data = await authenticatedRequest(`/books/${bookId}/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify({ card: validatedData }),
    });

    const card = cardSchema.parse(data);
    return NextResponse.json(card);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.UPDATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string; cardId: string }> },
) {
  try {
    const { bookId, cardId } = await params;
    await authenticatedRequest(`/books/${bookId}/cards/${cardId}`, {
      method: 'DELETE',
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.DELETE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
