import { topPageSchema, type TopPageData } from '@/schemas/top';

/**
 * トップページデータを取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchTopPageData(): Promise<TopPageData> {
  const response = await fetch('/api/top');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'トップページデータの取得に失敗しました');
  }

  const data = await response.json();
  return topPageSchema.parse(data);
}
