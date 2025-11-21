import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchCards } from '@/app/(protected)/cards/_lib/fetchCards';
import CardsClient from '@/app/(protected)/cards/_components/clients/CardsClient';

export default async function CardsPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.cards.all,
    queryFn: fetchCards,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CardsClient />
    </HydrationBoundary>
  );
}
