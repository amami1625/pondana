import { CARDS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function deleteCard({
  bookId,
  cardId,
}: {
  bookId: string;
  cardId: string;
}): Promise<void> {
  try {
    const response = await fetch(`/api/books/${bookId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      await handleApiError(response, CARDS_ERROR_MESSAGES, 'Cards');
    }

    // DELETEは204 No Contentを返すため、レスポンスボディは空
  } catch (error) {
    handleNetworkError(error, CARDS_ERROR_MESSAGES);
  }
}
