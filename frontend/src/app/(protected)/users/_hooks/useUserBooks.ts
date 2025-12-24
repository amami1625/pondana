import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchUserBooks } from '@/app/(protected)/users/_lib/query/fetchUserBooks';

export function useUserBooks(id: string) {
  return useQuery({
    queryKey: queryKeys.users.books(id),
    queryFn: () => fetchUserBooks(id),
    enabled: !!id,
  });
}
