import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { userSearchResultSchema } from '@/schemas/user';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET - ユーザー検索
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const data = await authenticatedRequest(`/users?q=${encodeURIComponent(query)}`, {}, false);
    const users = z.array(userSearchResultSchema).parse(data);
    return NextResponse.json(users);
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
