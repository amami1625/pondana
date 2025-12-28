import { authenticatedRequest } from '@/supabase/dal';
import { bookBaseSchema, bookDetailSchema } from '@/app/(protected)/books/_types';
import { ApiError } from '@/lib/errors/ApiError';
import { NextRequest, NextResponse } from 'next/server';

// GET - 詳細取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const data = await authenticatedRequest(`/books/${bookId}`, {}, false); // API Routeでは404をApiErrorとしてスロー
    const book = bookDetailSchema.parse(data);
    return NextResponse.json(book);
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

// PUT - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const body = await request.json();

    // category_idとratingのundefinedをnullに変換
    const bookData = {
      ...body,
      category_id: body.category_id ?? null,
      rating: body.rating ?? null,
    };

    const data = await authenticatedRequest(
      `/books/${bookId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ book: bookData }),
      },
      false, // API Routeでは404をApiErrorとしてスロー
    );
    const book = bookBaseSchema.parse(data);
    return NextResponse.json(book);
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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// DELETE - 削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    await authenticatedRequest(
      `/books/${bookId}`,
      {
        method: 'DELETE',
      },
      false, // API Routeでは404をApiErrorとしてスロー
    );

    return NextResponse.json({ success: true });
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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
