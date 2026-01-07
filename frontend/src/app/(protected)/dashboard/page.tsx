import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import DashboardClient from '@/app/(protected)/dashboard/_components/clients/DashboardClient';
import { authenticatedRequest } from '@/supabase/dal';
import { dashboardSchema } from '@/schemas/dashboard';

export default async function DashboardPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/dashboard');
      return dashboardSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
