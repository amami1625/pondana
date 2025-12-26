import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { userSchema } from '@/schemas/user';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await authenticatedRequest('/profile', {}, false);
    const profile = userSchema.parse(data);
    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
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
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
