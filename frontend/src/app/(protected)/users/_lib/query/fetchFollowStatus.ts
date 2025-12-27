import { FOLLOW_ERROR_MESSAGES } from '../constants/errorMessages';
import { FollowStatus, followStatusSchema } from '@/app/(protected)/users/_types';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function fetchFollowStatus(userId: string): Promise<FollowStatus> {
  try {
    const response = await fetch(`/api/users/${userId}/follow-status`);

    if (!response.ok) {
      await handleApiError(response, FOLLOW_ERROR_MESSAGES, 'Users');
    }

    const data = await response.json();
    return followStatusSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, FOLLOW_ERROR_MESSAGES);
  }
}
