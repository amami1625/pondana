import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { cardDetailSchema } from '@/app/(protected)/cards/_types';

export function useCard(id: number) {
  return useQuery({
    queryKey: queryKeys.cards.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/cards/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カード詳細の取得に失敗しました');
      }

      const data = await response.json();
      return cardDetailSchema.parse(data);
    },
  });
}
