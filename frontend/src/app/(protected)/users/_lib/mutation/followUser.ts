import { FOLLOW_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

interface FollowResponse {
  message: string;
}

export async function followUser(userId: string): Promise<FollowResponse> {
  try {
    const response = await fetch(`/api/users/${userId}/follow`, {
      method: 'POST',
    });

    if (!response.ok) {
      await handleApiError(response, FOLLOW_ERROR_MESSAGES, 'Users');
    }

    return response.json();
  } catch (error) {
    handleNetworkError(error, FOLLOW_ERROR_MESSAGES);
  }
}
