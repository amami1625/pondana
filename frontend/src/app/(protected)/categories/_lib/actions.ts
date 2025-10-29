'use server';

import { authenticatedRequest } from '@/supabase/dal';
import { Category, CategoryFormData, categorySchema } from '@/app/(protected)/categories/_types';

export async function createCategory(
  formData: CategoryFormData,
): Promise<Category | { error: string }> {
  try {
    const category = await authenticatedRequest('/categories', {
      method: 'POST',
      body: JSON.stringify({ category: formData }),
    });
    return categorySchema.parse(category);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
}

export async function updateCategory(
  formData: CategoryFormData,
): Promise<Category | { error: string }> {
  if (!formData.id) {
    return { error: 'カテゴリIDが指定されていません' };
  }

  try {
    const category = await authenticatedRequest(`/categories/${formData.id}`, {
      method: 'PUT',
      body: JSON.stringify({ category: formData }),
    });
    return categorySchema.parse(category);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
}
