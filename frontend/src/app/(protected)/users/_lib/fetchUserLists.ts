import { listDetailSchema, type ListDetail } from '@/schemas/list';
import { z } from 'zod';

/**
 * ユーザーの公開リスト一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchUserLists(id: string): Promise<ListDetail[]> {
  const response = await fetch(`/api/users/${id}/lists`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'ユーザーの公開リスト一覧の取得に失敗しました');
  }

  const data = await response.json();
  return z.array(listDetailSchema).parse(data);
}
