import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import AuthorsClient from '@/app/(protected)/settings/_components/clients/AuthorsClient';
import { fetchAuthors } from '@/app/(protected)/authors/_lib/fetchAuthors';

export default async function SettingsAuthorsPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.authors.all,
    queryFn: fetchAuthors,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthorsClient />
    </HydrationBoundary>
  );
}
