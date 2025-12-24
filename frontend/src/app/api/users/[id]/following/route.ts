import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { NextRequest, NextResponse } from 'next/server';

// GET - フォロー中のユーザー一覧取得
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/users/${id}/following`);
    return NextResponse.json(data);
  } catch (error) {
    // ApiErrorの場合はステータスコードとエラーコードを保持
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode },
      );
    }

    // ネットワークエラーの場合（Next.js → Rails 間の通信失敗）
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          error: error.message, // 技術的なメッセージ（開発時のデバッグ用）
          code: 'NETWORK_ERROR',
        },
        { status: 503 }, // Service Unavailable
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
