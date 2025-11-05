import { NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { cardListSchema } from '@/app/(protected)/cards/_types';

export async function GET() {
  try {
    const data = await authenticatedRequest('/cards');
    const cards = cardListSchema.parse(data);
    return NextResponse.json(cards);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
