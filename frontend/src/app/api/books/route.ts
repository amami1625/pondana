import { authenticatedRequest } from '@/supabase/dal';
import { bookSchema } from '@/app/(protected)/books/_types';
import { NextResponse } from 'next/server';

// GET - 一覧取得
export async function GET() {
  try {
    const data = await authenticatedRequest('/books');
    const books = bookSchema.array().parse(data);
    return NextResponse.json(books);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
