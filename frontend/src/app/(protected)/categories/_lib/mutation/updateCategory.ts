import { Category, categorySchema } from '@/app/(protected)/categories/_types';
import { CATEGORIES_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

// 更新用の型
export interface UpdateCategoryData {
  id: number;
  name: string;
}

export async function updateCategory(data: UpdateCategoryData): Promise<Category> {
  try {
    const { id, ...updateData } = data;
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
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
