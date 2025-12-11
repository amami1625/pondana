import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchCard } from '@/app/(protected)/cards/_lib/fetchCard';

export function useCard(id: string) {
  return useQuery({
    queryKey: queryKeys.cards.detail(id),
    queryFn: () => fetchCard(id),
    enabled: !!id,
  });
}
