import { authorSchema } from '@/app/(protected)/authors/_types';

/**
 * カテゴリ一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCategories() {
  const response = await fetch('/api/categories');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'カテゴリの取得に失敗しました');
  }

  const data = await response.json();
  return authorSchema.array().parse(data);
}
