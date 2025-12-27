import { categorySchema, type Category } from '@/app/(protected)/categories/_types';
import { CATEGORIES_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * カテゴリ一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');

    if (!response.ok) {
      await handleApiError(response, CATEGORIES_ERROR_MESSAGES, 'Categories');
    }

    const data = await response.json();
    return categorySchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, CATEGORIES_ERROR_MESSAGES);
  }
}
