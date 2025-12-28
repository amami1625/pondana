import { userWithStatsSchema, type UserWithStats } from '@/app/(protected)/users/_types';
import { USERS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * ユーザー情報と統計を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchUser(id: string): Promise<UserWithStats> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      await handleApiError(response, USERS_ERROR_MESSAGES, 'Users');
    }

    const data = await response.json();
    return userWithStatsSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, USERS_ERROR_MESSAGES);
  }
}
