import { authenticatedRequest } from '@/supabase/dal';
import { listBaseSchema, listSchema } from '@/app/(protected)/lists/_types';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { NextRequest, NextResponse } from 'next/server';

// エラーメッセージ
const ERROR_MESSAGES = {
  NOT_FOUND: 'リストの取得に失敗しました',
  CREATE_FAILED: 'リストの作成に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/lists');
    const lists = listSchema.array().parse(data);
    return NextResponse.json(lists);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

// POST - 作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: 将来的にzodのスキーマで変換を行うように変更する
    const listData = {
      ...body,
      description: body.description?.trim() || null,
    };

    const data = await authenticatedRequest('/lists', {
      method: 'POST',
      body: JSON.stringify({ list: listData }),
    });
    const list = listBaseSchema.parse(data);
    return NextResponse.json(list);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.CREATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
