import { Status, StatusFormData } from '@/app/(protected)/statuses/_types';
import { STATUSES_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export type UpdateStatusData = StatusFormData & { id: number };

export async function updateStatus(data: UpdateStatusData): Promise<Status> {
  try {
    const { id, ...updateData } = data;
    const response = await fetch(`/api/statuses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      await handleApiError(response, STATUSES_ERROR_MESSAGES, 'Statuses');
    }

    return response.json() as Promise<Status>;
  } catch (error) {
    handleNetworkError(error, STATUSES_ERROR_MESSAGES);
  }
}
