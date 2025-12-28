import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchBook } from '@/app/(protected)/books/_lib/query/fetchBook';

export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => fetchBook(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 60秒間キャッシュを新鮮として扱う
  });
}
