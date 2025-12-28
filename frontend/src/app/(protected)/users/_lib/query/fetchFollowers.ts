import { FOLLOW_ERROR_MESSAGES } from '@/constants/errorMessages';
import { User, userSchema } from '@/app/(protected)/users/_types';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function fetchFollowers(userId: string): Promise<User[]> {
  try {
    const response = await fetch(`/api/users/${userId}/followers`);

    if (!response.ok) {
      await handleApiError(response, FOLLOW_ERROR_MESSAGES, 'Users');
    }

    const data = await response.json();
    return userSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, FOLLOW_ERROR_MESSAGES);
  }
}
