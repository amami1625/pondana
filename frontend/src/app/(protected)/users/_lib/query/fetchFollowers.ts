import { User, userSchema } from '@/app/(protected)/users/_types';

export async function fetchFollowers(userId: string): Promise<User[]> {
  const response = await fetch(`/api/users/${userId}/followers`);

  if (!response.ok) {
    throw new Error('フォロワー一覧の取得に失敗しました');
  }

  const data = await response.json();
  return userSchema.array().parse(data);
}
