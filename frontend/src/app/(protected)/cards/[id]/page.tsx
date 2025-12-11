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

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.cards.detail(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/cards/${id}`);
      return cardDetailSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CardDetailClient id={id} />
    </HydrationBoundary>
  );
}
