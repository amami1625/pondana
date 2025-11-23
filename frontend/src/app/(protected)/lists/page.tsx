import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchLists } from '@/app/(protected)/lists/_lib/fetchLists';
import ListsClient from '@/app/(protected)/lists/_components/clients/ListsClient';

export default async function ListPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.lists.all,
    queryFn: fetchLists,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListsClient />
    </HydrationBoundary>
  );
}
