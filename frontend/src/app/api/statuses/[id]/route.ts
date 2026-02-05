import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { statusSchema } from '@/app/(protected)/statuses/_types';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  UPDATE_FAILED: 'ステータスの更新に失敗しました',
  DELETE_FAILED: 'ステータスの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = await authenticatedRequest(
      `/statuses/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status: body }),
      },
      false,
    );
    const status = statusSchema.parse(data);
    return NextResponse.json(status);
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await authenticatedRequest(
      `/statuses/${id}`,
      {
        method: 'DELETE',
      },
      false,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.DELETE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
