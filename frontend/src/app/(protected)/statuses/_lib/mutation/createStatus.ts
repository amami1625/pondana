import { Status, StatusFormData } from '@/app/(protected)/statuses/_types';
import { STATUSES_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function createStatus(data: StatusFormData): Promise<Status> {
  try {
    const response = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, STATUSES_ERROR_MESSAGES, 'Statuses');
    }

    return response.json() as Promise<Status>;
  } catch (error) {
    handleNetworkError(error, STATUSES_ERROR_MESSAGES);
  }
}
