import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { listBookSchema } from '@/schemas/listBooks';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  ADD_FAILED: 'リストへの本の追加に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

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
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.ADD_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
