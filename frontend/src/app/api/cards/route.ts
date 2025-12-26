import { NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { cardListSchema } from '@/app/(protected)/cards/_types';

export async function GET() {
  try {
    const data = await authenticatedRequest('/cards', {}, false);
    const cards = cardListSchema.parse(data);
    return NextResponse.json(cards);
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
