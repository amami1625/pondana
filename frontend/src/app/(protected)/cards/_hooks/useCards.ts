import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { cardListSchema } from '@/app/(protected)/cards/_types';

export function useCards() {
  return useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: async () => {
      const response = await fetch('/api/cards');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カード一覧の取得に失敗しました');
      }

      const data = await response.json();
      return cardListSchema.parse(data);
    },
  });
}
