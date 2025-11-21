import { topPageSchema, type TopPageData } from '@/schemas/top';

/**
 * トップページデータを取得する
 * サーバーコンポーネント（prefetch）とクライアントコンポーネント（useQuery）の両方で使用
 */
export async function fetchTopPageData(): Promise<TopPageData> {
  // サーバー側の場合は絶対URL、クライアント側の場合は相対URL
  const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_URL : '';
  const response = await fetch(`${baseUrl}/api/top`, {
    // サーバー側では常に最新データを取得
    cache: typeof window === 'undefined' ? 'no-store' : 'default',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'トップページデータの取得に失敗しました');
  }

  const data = await response.json();
  return topPageSchema.parse(data);
}
