import { Tag, TagFormData } from '@/app/(protected)/tags/_types';
import { TAGS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function createTag(data: TagFormData): Promise<Tag> {
  try {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, TAGS_ERROR_MESSAGES, 'Tags');
    }

    return response.json() as Promise<Tag>;
  } catch (error) {
    handleNetworkError(error, TAGS_ERROR_MESSAGES);
  }
}
