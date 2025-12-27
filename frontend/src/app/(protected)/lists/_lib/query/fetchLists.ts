import { listSchema, type List } from '@/app/(protected)/lists/_types';
import { LISTS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * リスト一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchLists(): Promise<List[]> {
  try {
    const response = await fetch('/api/lists');

    if (!response.ok) {
      await handleApiError(response, LISTS_ERROR_MESSAGES, 'Lists');
    }

    const data = await response.json();
    return listSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, LISTS_ERROR_MESSAGES);
  }
}
