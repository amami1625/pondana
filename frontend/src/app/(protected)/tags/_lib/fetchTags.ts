import { tagSchema, type Tag } from '@/app/(protected)/tags/_types';

/**
 * タグ一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch('/api/tags');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'タグの取得に失敗しました');
  }

  const data = await response.json();
  return tagSchema.array().parse(data);
}
