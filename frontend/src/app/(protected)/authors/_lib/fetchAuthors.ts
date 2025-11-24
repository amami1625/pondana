import { authorSchema, type Author } from '@/app/(protected)/authors/_types';

/**
 * 著者一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchAuthors(): Promise<Author[]> {
  const response = await fetch('/api/authors');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '著者一覧の取得に失敗しました');
  }

  const data = await response.json();
  return authorSchema.array().parse(data);
}
