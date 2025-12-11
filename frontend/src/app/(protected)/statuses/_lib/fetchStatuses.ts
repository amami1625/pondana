import { statusSchema, type Status } from '@/app/(protected)/statuses/_types';

/**
 * ステータス一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchStatuses(): Promise<Status[]> {
  const response = await fetch('/api/statuses');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'ステータスの取得に失敗しました');
  }

  const data = await response.json();
  return statusSchema.array().parse(data);
}
