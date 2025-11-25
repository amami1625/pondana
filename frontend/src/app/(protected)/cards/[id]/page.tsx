import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import CardDetailClient from '@/app/(protected)/cards/_components/clients/CardDetailClient';
import { authenticatedRequest } from '@/supabase/dal';
import { cardDetailSchema } from '@/app/(protected)/cards/_types';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const cardId = Number(id);

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.cards.detail(cardId),
    queryFn: async () => {
      const data = authenticatedRequest(`/cards/${cardId}`);
      return cardDetailSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CardDetailClient id={cardId} />
    </HydrationBoundary>
  );
}
