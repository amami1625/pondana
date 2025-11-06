import { NextRequest, NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { cardDetailSchema } from '@/app/(protected)/cards/_types';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await authenticatedRequest(`/cards/${id}`);
    const card = cardDetailSchema.parse(data);
    return NextResponse.json(card);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
