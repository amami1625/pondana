import { authenticatedRequest } from '@/supabase/dal';
import { listBaseSchema, listDetailSchema } from '@/app/(protected)/lists/_types';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { NextRequest, NextResponse } from 'next/server';

// エラーメッセージ
const ERROR_MESSAGES = {
  NOT_FOUND: 'リストの取得に失敗しました',
  UPDATE_FAILED: 'リストの更新に失敗しました',
  DELETE_FAILED: 'リストの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

// GET - 詳細取得
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/lists/${id}`, {}, false);
    const list = listDetailSchema.parse(data);
    return NextResponse.json(list);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

// PUT - 更新
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: 将来的にzodのスキーマで変換を行うように変更する
    const listData = {
      ...body,
      description: body.description?.trim() || null,
    };

    const data = await authenticatedRequest(
      `/lists/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ list: listData }),
      },
      false,
    );
    const list = listBaseSchema.parse(data);
    return NextResponse.json(list);
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
      `/lists/${id}`,
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
