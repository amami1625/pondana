import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { topPageSchema } from '@/schemas/top';
import { NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'トップページデータの取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET() {
  try {
    const data = await authenticatedRequest('/top');
    const topPageData = topPageSchema.parse(data);
    return NextResponse.json(topPageData);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
