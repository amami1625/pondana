import { listDetailSchema, type ListDetail } from '@/app/(protected)/lists/_types';

/**
 * リスト詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchList(id: string): Promise<ListDetail> {
  const response = await fetch(`/api/lists/${id}`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return listDetailSchema.parse(data);
}
