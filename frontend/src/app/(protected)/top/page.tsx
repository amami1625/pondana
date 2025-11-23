import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchTopPageData } from '@/app/(protected)/top/_lib/fetchTopPageData';
import TopClient from '@/app/(protected)/top/_components/clients/TopClient';

export default async function TopPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.top.all,
    queryFn: fetchTopPageData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopClient />
    </HydrationBoundary>
  );
}
