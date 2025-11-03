import { authenticatedRequest } from '@/supabase/dal';
import { categorySchema } from '@/app/(protected)/categories/_types';
import { NextRequest, NextResponse } from 'next/server';

// GET - 取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/categories');
    const categories = categorySchema.array().parse(data);
    return NextResponse.json(categories);
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
    const data = await authenticatedRequest('/categories', {
      method: 'POST',
      body: JSON.stringify({ category: body }),
    });
    const category = categorySchema.parse(data);
    return NextResponse.json(category);
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

    const data = await authenticatedRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ category: updateData }),
    });
    const category = categorySchema.parse(data);
    return NextResponse.json(category);
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

    await authenticatedRequest(`/categories/${id}`, {
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
