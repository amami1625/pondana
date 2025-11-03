import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { listSchema } from '@/app/(protected)/lists/_types';

export function useLists() {
  return useQuery({
    queryKey: queryKeys.lists.all,
    queryFn: async () => {
      const response = await fetch('/api/lists');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リスト一覧の取得に失敗しました');
      }

      const data = await response.json();
      return listSchema.array().parse(data);
    },
  });
}
