import { STATUSES_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function deleteStatus(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/statuses/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await handleApiError(response, STATUSES_ERROR_MESSAGES, 'Statuses');
    }
  } catch (error) {
    handleNetworkError(error, STATUSES_ERROR_MESSAGES);
  }
}
