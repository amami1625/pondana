import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchBook } from '@/app/(protected)/books/_lib/fetchBook';

export function useBook(id: number) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => fetchBook(id),
    enabled: !!id,
  });
}
