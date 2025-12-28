import { Category, CategoryFormData, categorySchema } from '@/app/(protected)/categories/_types';
import { CATEGORIES_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function createCategory(data: CategoryFormData): Promise<Category> {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, CATEGORIES_ERROR_MESSAGES, 'Categories');
    }

    const res = await response.json();
    return categorySchema.parse(res);
  } catch (error) {
    handleNetworkError(error, CATEGORIES_ERROR_MESSAGES);
  }
}
