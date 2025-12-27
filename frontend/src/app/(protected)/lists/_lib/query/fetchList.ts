import { listDetailSchema, type ListDetail } from '@/app/(protected)/lists/_types';
import { LISTS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * リスト詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchList(id: string): Promise<ListDetail> {
  try {
    const response = await fetch(`/api/lists/${id}`);

    if (!response.ok) {
      await handleApiError(response, LISTS_ERROR_MESSAGES, 'Lists');
    }

    const data = await response.json();
    return listDetailSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, LISTS_ERROR_MESSAGES);
  }
}
