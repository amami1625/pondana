import { cardListSchema, type CardList } from '@/app/(protected)/cards/_types';

/**
 * カード一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCards(): Promise<CardList> {
  const response = await fetch('/api/cards');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return cardListSchema.parse(data);
}
