import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchFollowStatus } from '@/app/(protected)/users/_lib/query/fetchFollowStatus';

export function useFollowStatus(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.followStatus(userId),
    queryFn: () => fetchFollowStatus(userId),
    enabled: !!userId,
  });
}
