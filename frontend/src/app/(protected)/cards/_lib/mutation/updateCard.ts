import { Card, CardFormData, cardSchema } from '@/app/(protected)/cards/_types';
import { CARDS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

// 更新用の型
type UpdateCardData = CardFormData & { id: string };

export async function updateCard(data: UpdateCardData): Promise<Card> {
  try {
    const response = await fetch(`/api/books/${data.book_id}/cards/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, CARDS_ERROR_MESSAGES, 'Cards');
    }

    const res = await response.json();
    return cardSchema.parse(res);
  } catch (error) {
    handleNetworkError(error, CARDS_ERROR_MESSAGES);
  }
}
