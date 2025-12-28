import { listSchema, type List } from '@/schemas/list';
import { USERS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * ユーザーの公開リスト一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchUserLists(id: string): Promise<List[]> {
  try {
    const response = await fetch(`/api/users/${id}/lists`);

    if (!response.ok) {
      await handleApiError(response, USERS_ERROR_MESSAGES, 'Users');
    }

    const data = await response.json();
    return listSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, USERS_ERROR_MESSAGES);
  }
}
