import { queryKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { fetchStatuses } from '@/app/(protected)/statuses/_lib/fetchStatuses';

export function useStatuses() {
  return useQuery({
    queryKey: queryKeys.statuses.all,
    queryFn: fetchStatuses,
  });
}
