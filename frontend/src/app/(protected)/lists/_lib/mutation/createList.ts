import { ListBase, listBaseSchema, ListFormData } from '@/app/(protected)/lists/_types';
import { LISTS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function createList(data: ListFormData): Promise<ListBase> {
  try {
    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, LISTS_ERROR_MESSAGES, 'Lists');
    }

    const res = await response.json();
    return listBaseSchema.parse(res);
  } catch (error) {
    handleNetworkError(error, LISTS_ERROR_MESSAGES);
  }
}
