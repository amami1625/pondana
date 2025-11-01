import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { categorySchema } from '@/app/(protected)/categories/_types';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const response = await fetch('/api/categories');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カテゴリの取得に失敗しました');
      }

      const data = await response.json();
      return categorySchema.array().parse(data);
    },
  });
}
