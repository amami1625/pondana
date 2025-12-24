import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchFollowing } from '@/app/(protected)/users/_lib/query/fetchFollowing';

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.following(userId),
    queryFn: () => fetchFollowing(userId),
    enabled: !!userId,
  });
}
