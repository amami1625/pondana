import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { dashboardSchema } from '@/schemas/dashboard';
import { NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'ダッシュボードの取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET() {
  try {
    const data = await authenticatedRequest('/dashboard');
    const dashboard = dashboardSchema.parse(data);
    return NextResponse.json(dashboard);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
