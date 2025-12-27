import { BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function deleteBook({ id }: { id: string }): Promise<void> {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      await handleApiError(response, BOOKS_ERROR_MESSAGES, 'Books');
    }

    // DELETEは204 No Contentを返すため、レスポンスボディは空
  } catch (error) {
    handleNetworkError(error, BOOKS_ERROR_MESSAGES);
  }
}
