import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { bookDetailSchema } from '@/app/(protected)/books/_types';

export function useBook(id: number) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/books/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '書籍詳細の取得に失敗しました');
      }

      const data = await response.json();
      return bookDetailSchema.parse(data);
    },
    enabled: !!id, // id がある時だけクエリを実行
  });
}
