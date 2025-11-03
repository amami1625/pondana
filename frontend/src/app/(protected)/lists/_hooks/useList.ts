import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { listDetailSchema } from '@/app/(protected)/lists/_types';

export function useList(id: number) {
  return useQuery({
    queryKey: queryKeys.lists.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/lists/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リスト詳細の取得に失敗しました');
      }

      const data = await response.json();
      return listDetailSchema.parse(data);
    },
    enabled: !!id, // id がある時だけクエリを実行
  });
}
