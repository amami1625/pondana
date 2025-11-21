import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchCards } from '@/app/(protected)/cards/_lib/fetchCards';

export function useCards() {
  return useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: fetchCards,
  });
}
