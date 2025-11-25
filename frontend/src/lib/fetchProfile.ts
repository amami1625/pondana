import { userSchema, type User } from '@/schemas/user';

/**
 * プロフィール情報を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchProfile(): Promise<User> {
  const response = await fetch('/api/profiles');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'プロフィール情報の取得に失敗しました');
  }

  const data = await response.json();
  return userSchema.parse(data);
}
