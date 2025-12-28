import { CATEGORIES_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function deleteCategory(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      await handleApiError(response, CATEGORIES_ERROR_MESSAGES, 'Categories');
    }

    // DELETEは204 No Contentを返すため、レスポンスボディは空
  } catch (error) {
    handleNetworkError(error, CATEGORIES_ERROR_MESSAGES);
  }
}
