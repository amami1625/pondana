import { LISTS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function deleteList(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/lists/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      await handleApiError(response, LISTS_ERROR_MESSAGES, 'Lists');
    }

    // DELETEは204 No Contentを返すため、レスポンスボディは空
  } catch (error) {
    handleNetworkError(error, LISTS_ERROR_MESSAGES);
  }
}
