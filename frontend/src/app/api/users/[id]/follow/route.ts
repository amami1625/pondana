import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  FOLLOW_FAILED: 'フォローに失敗しました',
  UNFOLLOW_FAILED: 'フォロー解除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}/follow`, {
      method: 'POST',
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.FOLLOW_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}/follow`, {
      method: 'DELETE',
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.UNFOLLOW_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
