import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchFollowers } from '@/app/(protected)/users/_lib/query/fetchFollowers';

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.followers(userId),
    queryFn: () => fetchFollowers(userId),
    enabled: !!userId,
  });
}
