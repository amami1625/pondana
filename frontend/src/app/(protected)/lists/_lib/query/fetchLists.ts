import { listSchema, type List } from '@/app/(protected)/lists/_types';

/**
 * リスト一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchLists(): Promise<List[]> {
  const response = await fetch('/api/lists');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return listSchema.array().parse(data);
}
