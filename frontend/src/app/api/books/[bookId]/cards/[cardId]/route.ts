import { NextRequest, NextResponse } from 'next/server';
import { authenticatedRequest } from '@/supabase/dal';
import { cardFormSchema, cardSchema } from '@/app/(protected)/cards/_types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string; cardId: string }> },
) {
  try {
    const { bookId, cardId } = await params;
    const body = await request.json();
    const validatedData = cardFormSchema.parse(body);

    const data = await authenticatedRequest(`/books/${bookId}/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify({ card: validatedData }),
    });

    const card = cardSchema.parse(data);
    return NextResponse.json(card);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string; cardId: string }> },
) {
  try {
    const { bookId, cardId } = await params;
    await authenticatedRequest(`/books/${bookId}/cards/${cardId}`, {
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
