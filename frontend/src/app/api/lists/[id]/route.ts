import { authenticatedRequest } from '@/supabase/dal';
import { listBaseSchema, listDetailSchema } from '@/app/(protected)/lists/_types';
import { ApiError } from '@/lib/errors/ApiError';
import { NextRequest, NextResponse } from 'next/server';

// GET - 詳細取得
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/lists/${id}`, {}, false);
    const list = listDetailSchema.parse(data);
    return NextResponse.json(list);
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
