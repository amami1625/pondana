import { authenticatedRequest } from '@/supabase/dal';
import { handleRouteError } from '@/lib/api/handleRouteError';
import { userSchema } from '@/schemas/user';
import { NextResponse } from 'next/server';

const ERROR_MESSAGES = {
  NOT_FOUND: 'プロフィール情報の取得に失敗しました',
  UPDATE_FAILED: 'プロフィールの更新に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN: 'エラーが発生しました。もう一度お試しください',
};

export async function GET() {
  try {
    const data = await authenticatedRequest('/profile');
    const profile = userSchema.parse(data);
    return NextResponse.json(profile);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.NOT_FOUND,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // TODO: 将来的にzodのスキーマで変換を行うように変更する
    const profileData = {
      ...body,
      avatar_url: body.avatar_url?.trim() || null,
    };

    const data = await authenticatedRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile: profileData }),
    });

    const updatedProfile = userSchema.parse(data);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return handleRouteError(error, {
      apiError: ERROR_MESSAGES.UPDATE_FAILED,
      networkError: ERROR_MESSAGES.NETWORK_ERROR,
      unknown: ERROR_MESSAGES.UNKNOWN,
    });
  }
}
