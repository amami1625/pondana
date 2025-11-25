import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { authenticatedRequest } from '@/supabase/dal';
import { topPageSchema } from '@/schemas/top';
import TopClient from '@/app/(protected)/top/_components/clients/TopClient';

export default async function TopPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch（直接 Rails API にアクセス）
  await queryClient.prefetchQuery({
    queryKey: queryKeys.top.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/top');
      return topPageSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopClient />
    </HydrationBoundary>
  );
}
