interface FollowResponse {
  message: string;
}

export async function followUser(userId: string): Promise<FollowResponse> {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: 'POST',
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  return response.json();
}
