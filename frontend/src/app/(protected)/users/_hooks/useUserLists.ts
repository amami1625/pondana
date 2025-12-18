import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchUserLists } from '@/app/(protected)/users/_lib/fetchUserLists';

export function useUserLists(id: string) {
  return useQuery({
    queryKey: queryKeys.users.lists(id),
    queryFn: () => fetchUserLists(id),
    enabled: !!id,
  });
}
