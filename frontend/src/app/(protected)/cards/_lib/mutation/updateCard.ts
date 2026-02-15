import { Card, CardFormData, cardSchema } from '@/app/(protected)/cards/_types';

// 更新用の型
type UpdateCardData = CardFormData & { id: string };

export async function updateCard(data: UpdateCardData): Promise<Card> {
  const response = await fetch(`/api/books/${data.book_id}/cards/${data.id}`, {
    method: 'PUT',
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
