import { TAGS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function deleteTag({ id }: { id: number }): Promise<void> {
  try {
    const response = await fetch(`/api/tags/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await handleApiError(response, TAGS_ERROR_MESSAGES, 'Tags');
    }
  } catch (error) {
    handleNetworkError(error, TAGS_ERROR_MESSAGES);
  }
}
