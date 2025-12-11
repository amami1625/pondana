import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { authenticatedRequest } from '@/supabase/dal';
import { statusSchema } from '@/schemas/status';
import StatusesClient from '@/app/(protected)/settings/_components/clients/StatusesClient';

export default async function SettingsStatusesPage() {
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.statuses.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/statuses');
      return statusSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatusesClient />
    </HydrationBoundary>
  );
}
