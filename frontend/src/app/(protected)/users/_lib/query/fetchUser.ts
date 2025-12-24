import { userWithStatsSchema, type UserWithStats } from '@/app/(protected)/users/_types';

/**
 * ユーザー情報と統計を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchUser(id: string): Promise<UserWithStats> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'ユーザー情報の取得に失敗しました');
  }

  const data = await response.json();
  return userWithStatsSchema.parse(data);
}
