import { Card, CardFormData, cardSchema } from '@/app/(protected)/cards/_types';

export async function createCard(data: CardFormData): Promise<Card> {
  const response = await fetch(`/api/books/${data.book_id}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return cardSchema.parse(res);
}
