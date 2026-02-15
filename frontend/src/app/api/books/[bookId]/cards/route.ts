import { NextRequest, NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { cardFormSchema, cardSchema } from '@/app/(protected)/cards/_types';

const ERROR_MESSAGES = {
  CREATE_FAILED: 'カードの作成に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const body = await request.json();
    const validatedData = cardFormSchema.parse(body);

    const data = await authenticatedRequest(`/books/${bookId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ card: validatedData }),
    });

    const card = cardSchema.parse(data);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.CREATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
