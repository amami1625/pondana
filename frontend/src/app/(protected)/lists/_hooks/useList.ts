import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchList } from '@/app/(protected)/lists/_lib/fetchList';

export function useList(id: string) {
  return useQuery({
    queryKey: queryKeys.lists.detail(id),
    queryFn: () => fetchList(id),
    enabled: !!id,
  });
}
