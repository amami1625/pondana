import { authenticatedRequest } from '@/supabase/dal';
import { NextRequest, NextResponse } from 'next/server';
import { authorSchema } from '@/app/(protected)/authors/_types';

// GET - 一覧取得
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
