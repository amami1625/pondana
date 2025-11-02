import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { authorSchema } from '@/app/(protected)/authors/_types';

export function useAuthors() {
  return useQuery({
    queryKey: queryKeys.authors.all,
    queryFn: async () => {
      const response = await fetch('/api/authors');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '著者情報の取得に失敗しました');
      }

      const data = await response.json();
      return authorSchema.array().parse(data);
    },
  });
}
