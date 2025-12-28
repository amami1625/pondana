import { topPageSchema, type TopPageData } from '@/schemas/top';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';
import { TOP_ERROR_MESSAGES } from '@/constants/errorMessages';

/**
 * トップページデータを取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchTopPageData(): Promise<TopPageData> {
  try {
    const response = await fetch('/api/top');

    if (!response.ok) {
      await handleApiError(response, TOP_ERROR_MESSAGES, 'Top');
    }

    const data = await response.json();
    return topPageSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, TOP_ERROR_MESSAGES);
  }
}
