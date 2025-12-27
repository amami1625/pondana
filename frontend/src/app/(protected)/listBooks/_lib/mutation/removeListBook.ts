import { LIST_BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function removeListBook({ id }: { id: number }): Promise<void> {
  try {
    const response = await fetch(`/api/list_books/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await handleApiError(response, LIST_BOOKS_ERROR_MESSAGES, 'ListBooks');
    }
  } catch (error) {
    handleNetworkError(error, LIST_BOOKS_ERROR_MESSAGES);
  }
}
