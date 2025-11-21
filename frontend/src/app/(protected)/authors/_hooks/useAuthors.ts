import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchAuthors } from '@/app/(protected)/authors/_lib/fetchAuthors';

export function useAuthors() {
  return useQuery({
    queryKey: queryKeys.authors.all,
    queryFn: fetchAuthors,
  });
}
