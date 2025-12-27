import { queryKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '@/app/(protected)/tags/_lib/query/fetchTags';

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: fetchTags,
  });
}
