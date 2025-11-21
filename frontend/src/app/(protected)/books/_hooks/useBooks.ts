import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchBooks } from '@/app/(protected)/books/_lib/fetchBooks';

export function useBooks() {
  return useQuery({
    queryKey: queryKeys.books.all,
    queryFn: fetchBooks,
  });
}
