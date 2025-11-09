import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { topPageSchema } from '@/schemas/top';

export function useTopPageData() {
  return useQuery({
    queryKey: queryKeys.top.all,
    queryFn: async () => {
      const response = await fetch('/api/top');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'トップページデータの取得に失敗しました');
      }

      const data = await response.json();
      return topPageSchema.parse(data);
    },
  });
}
