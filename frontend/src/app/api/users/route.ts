import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { userSearchResultSchema } from '@/schemas/user';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ERROR_MESSAGES = {
  SEARCH_FAILED: 'ユーザー検索に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const data = await authenticatedRequest(`/users?q=${encodeURIComponent(query)}`);
    const users = z.array(userSearchResultSchema).parse(data);
    return NextResponse.json(users);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.SEARCH_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
