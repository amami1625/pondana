import { statusSchema, type Status } from '@/app/(protected)/statuses/_types';
import { STATUSES_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * ステータス一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchStatuses(): Promise<Status[]> {
  try {
    const response = await fetch('/api/statuses');

    if (!response.ok) {
      await handleApiError(response, STATUSES_ERROR_MESSAGES, 'Statuses');
    }

    const data = await response.json();
    return statusSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, STATUSES_ERROR_MESSAGES);
  }
}
