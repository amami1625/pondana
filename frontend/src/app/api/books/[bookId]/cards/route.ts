import { NextRequest, NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { ApiError } from '@/lib/errors/ApiError';
import { cardFormSchema, cardSchema } from '@/app/(protected)/cards/_types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;
    const body = await request.json();
    const validatedData = cardFormSchema.parse(body);

    const data = await authenticatedRequest(
      `/books/${bookId}/cards`,
      {
        method: 'POST',
        body: JSON.stringify({ card: validatedData }),
      },
      false,
    );

    const card = cardSchema.parse(data);
    return NextResponse.json(card, { status: 201 });
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
