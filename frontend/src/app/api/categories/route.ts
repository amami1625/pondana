import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { categorySchema } from '@/app/(protected)/categories/_types';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'カテゴリの取得に失敗しました',
  CREATE_FAILED: 'カテゴリの作成に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/categories', {}, false);
    const categories = categorySchema.array().parse(data);
    return NextResponse.json(categories);
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
    const data = await authenticatedRequest(
      '/categories',
      {
        method: 'POST',
        body: JSON.stringify({ category: body }),
      },
      false,
    );
    const category = categorySchema.parse(data);
    return NextResponse.json(category);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.CREATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
