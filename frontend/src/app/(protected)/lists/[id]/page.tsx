import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import ListDetailClient from '@/app/(protected)/lists/_components/clients/ListDetailClient';
import { authenticatedRequest } from '@/supabase/dal';
import { listDetailSchema } from '@/app/(protected)/lists/_types';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListPage({ params }: Props) {
  const { id } = await params;
  const listId = Number(id);

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.lists.detail(listId),
    queryFn: async () => {
      const data = await authenticatedRequest(`/api/lists/${listId}`);
      return listDetailSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListDetailClient id={listId} />
    </HydrationBoundary>
  );
}
