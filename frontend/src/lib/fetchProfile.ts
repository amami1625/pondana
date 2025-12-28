import { userSchema, type User } from '@/schemas/user';
import { handleApiError, handleNetworkError } from './api/handleApiError';
import { PROFILE_ERROR_MESSAGES } from '@/constants/errorMessages';

/**
 * プロフィール情報を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchProfile(): Promise<User> {
  try {
    const response = await fetch('/api/profiles');

    if (!response.ok) {
      await handleApiError(response, PROFILE_ERROR_MESSAGES, 'Profile');
    }

    const data = await response.json();
    return userSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, PROFILE_ERROR_MESSAGES);
  }
}
