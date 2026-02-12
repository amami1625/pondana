import { NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { cardListSchema } from '@/app/(protected)/cards/_types';

const ERROR_MESSAGES = {
  NOT_FOUND: 'カードの取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET() {
  try {
    const data = await authenticatedRequest('/cards');
    const cards = cardListSchema.parse(data);
    return NextResponse.json(cards);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
