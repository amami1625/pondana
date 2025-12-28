import { Tag, TagFormData } from '@/app/(protected)/tags/_types';
import { TAGS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function updateTag(data: TagFormData & { id: number }): Promise<Tag> {
  try {
    const { id, ...updateData } = data;
    const response = await fetch(`/api/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      await handleApiError(response, TAGS_ERROR_MESSAGES, 'Tags');
    }

    return response.json() as Promise<Tag>;
  } catch (error) {
    handleNetworkError(error, TAGS_ERROR_MESSAGES);
  }
}
