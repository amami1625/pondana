import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import ListsClient from '@/app/(protected)/lists/_components/clients/ListsClient';
import { authenticatedRequest } from '@/supabase/dal';
import { listSchema } from '@/app/(protected)/lists/_types';

export default async function ListPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.lists.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/lists');
      return listSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListsClient />
    </HydrationBoundary>
  );
}
