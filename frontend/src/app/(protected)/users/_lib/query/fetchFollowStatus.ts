interface FollowStatus {
  is_following: boolean;
  is_followed_by: boolean;
}

export async function fetchFollowStatus(userId: string): Promise<FollowStatus> {
  const response = await fetch(`/api/users/${userId}/follow-status`);

  if (!response.ok) {
    throw new Error('フォロー状態の取得に失敗しました');
  }

  return response.json();
}
