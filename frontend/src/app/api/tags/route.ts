import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { tagSchema } from '@/app/(protected)/tags/_types';
import { NextRequest, NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'タグの取得に失敗しました',
  CREATE_FAILED: 'タグの作成に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET() {
  try {
    const data = await authenticatedRequest('/tags');
    const tags = tagSchema.array().parse(data);
    return NextResponse.json(tags);
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
    const data = await authenticatedRequest('/tags', {
      method: 'POST',
      body: JSON.stringify({ tag: body }),
    });
    const tag = tagSchema.parse(data);
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.CREATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
