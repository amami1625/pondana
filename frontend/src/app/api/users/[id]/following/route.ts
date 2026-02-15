import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'フォロー中のユーザー一覧の取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}/following`);
    return NextResponse.json(data);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
