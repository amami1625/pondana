interface FollowResponse {
  message: string;
}

interface FollowError {
  error: string | string[];
}

export async function unfollowUser(userId: string): Promise<FollowResponse> {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error: FollowError = await response.json();
    throw new Error(Array.isArray(error.error) ? error.error.join(', ') : error.error);
  }

  return response.json();
}
