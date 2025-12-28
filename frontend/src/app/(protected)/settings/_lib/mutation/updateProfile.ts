import { User, UserFormData } from '@/schemas/user';
import { PROFILE_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function updateProfile(data: UserFormData): Promise<User> {
  try {
    const response = await fetch('/api/profiles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, PROFILE_ERROR_MESSAGES, 'Profile');
    }

    return response.json() as Promise<User>;
  } catch (error) {
    handleNetworkError(error, PROFILE_ERROR_MESSAGES);
  }
}
