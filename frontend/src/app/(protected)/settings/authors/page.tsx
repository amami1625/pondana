import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import AuthorsClient from '@/app/(protected)/settings/_components/clients/AuthorsClient';
import { authenticatedRequest } from '@/supabase/dal';
import { authorSchema } from '@/app/(protected)/authors/_types';

export default async function SettingsAuthorsPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.authors.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/authors');
      return authorSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthorsClient />
    </HydrationBoundary>
  );
}
