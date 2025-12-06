import { cardDetailSchema, type CardDetail } from '@/app/(protected)/cards/_types';

/**
 * カード詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCard(id: string): Promise<CardDetail> {
  const response = await fetch(`/api/cards/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'カード詳細の取得に失敗しました');
  }

  const data = await response.json();
  return cardDetailSchema.parse(data);
}
