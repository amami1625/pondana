import { authorSchema } from '@/app/(protected)/authors/_types';

/**
 * 著者一覧を取得する
 * サーバーコンポーネント（prefetch）とクライアントコンポーネント（useQuery）の両方で使用
 */

export async function fetchAuthors() {
  // サーバー側の場合は絶対URL、クライアント側の場合は相対URL
  const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_URL : '';
  const response = await fetch(`${baseUrl}/api/authors`, {
    // サーバー側では常に最新データを取得
    cache: typeof window === 'undefined' ? 'no-store' : 'default',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '著者一覧の取得に失敗しました');
  }

  const data = await response.json();
  return authorSchema.array().parse(data);
}
