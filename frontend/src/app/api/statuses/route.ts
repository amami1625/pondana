import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { statusSchema } from '@/app/(protected)/statuses/_types';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'ステータスの取得に失敗しました',
  CREATE_FAILED: 'ステータスの作成に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET() {
  try {
    const data = await authenticatedRequest('/statuses', {}, false);
    const statuses = statusSchema.array().parse(data);
    return NextResponse.json(statuses);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await authenticatedRequest('/statuses', {
      method: 'POST',
      body: JSON.stringify({ status: body }),
    });
    const status = statusSchema.parse(data);
    return NextResponse.json(status);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.CREATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
