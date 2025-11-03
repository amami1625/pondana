import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { bookSchema } from '@/app/(protected)/books/_types';

export function useBooks() {
  return useQuery({
    queryKey: queryKeys.books.all,
    queryFn: async () => {
      const response = await fetch('/api/books');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '書籍一覧の取得に失敗しました');
      }

      const data = await response.json();
      return bookSchema.array().parse(data);
    },
  });
}
