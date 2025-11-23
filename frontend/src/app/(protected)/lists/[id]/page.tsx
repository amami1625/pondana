import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchList } from '@/app/(protected)/lists/_lib/fetchList';
import ListDetailClient from '@/app/(protected)/lists/_components/clients/ListDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListPage({ params }: Props) {
  const { id } = await params;
  const listId = Number(id);

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.lists.detail(listId),
    queryFn: () => fetchList(listId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListDetailClient id={listId} />
    </HydrationBoundary>
  );
}
