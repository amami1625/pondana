import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchTopPageData } from '@/app/(protected)/top/_lib/fetchTopPageData';

export function useTopPageData() {
  return useQuery({
    queryKey: queryKeys.top.all,
    queryFn: fetchTopPageData,
  });
}
