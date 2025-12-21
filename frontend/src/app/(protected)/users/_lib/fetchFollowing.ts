import { User, userSchema } from '@/app/(protected)/users/_types';

export async function fetchFollowing(userId: string): Promise<User[]> {
  const response = await fetch(`/api/users/${userId}/following`);

  if (!response.ok) {
    throw new Error('フォロー中のユーザー一覧の取得に失敗しました');
  }

  const data = await response.json();
  return userSchema.array().parse(data);
}
