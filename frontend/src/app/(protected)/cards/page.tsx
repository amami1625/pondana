import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import CardsClient from '@/app/(protected)/cards/_components/clients/CardsClient';
import { authenticatedRequest } from '@/supabase/dal';
import { cardListSchema } from '@/app/(protected)/cards/_types';

export default async function CardsPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.cards.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/cards');
      return cardListSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CardsClient />
    </HydrationBoundary>
  );
}
