import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { categorySchema } from '@/app/(protected)/categories/_types';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  UPDATE_FAILED: 'カテゴリの更新に失敗しました',
  DELETE_FAILED: 'カテゴリの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

// PUT - 更新
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = await authenticatedRequest(
      `/categories/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ category: body }),
      },
      false,
    );
    const category = categorySchema.parse(data);
    return NextResponse.json(category);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.UPDATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

// DELETE - 削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await authenticatedRequest(
      `/categories/${id}`,
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
