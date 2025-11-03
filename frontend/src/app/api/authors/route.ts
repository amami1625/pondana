import { authenticatedRequest } from '@/supabase/dal';
import { NextRequest, NextResponse } from 'next/server';
import { authorSchema } from '@/app/(protected)/authors/_types';

// GET - 取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/authors');
    const authors = authorSchema.array().parse(data);
    return NextResponse.json(authors);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// POST - 作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await authenticatedRequest('/authors', {
      method: 'POST',
      body: JSON.stringify({ author: body }),
    });
    const author = authorSchema.parse(data);
    return NextResponse.json(author);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// PUT - 更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const data = await authenticatedRequest(`/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ author: updateData }),
    });
    const author = authorSchema.parse(data);
    return NextResponse.json(author);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

// DELETE - 削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
    }

    await authenticatedRequest(`/authors/${id}`, {
      method: 'DELETE',
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
