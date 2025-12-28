import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchLists } from '@/app/(protected)/lists/_lib/query/fetchLists';

export function useLists() {
  return useQuery({
    queryKey: queryKeys.lists.all,
    queryFn: fetchLists,
  });
}
