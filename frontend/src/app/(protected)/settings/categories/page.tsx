import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import CategoriesClient from '@/app/(protected)/settings/_components/clients/CategoriesClient';
import { authenticatedRequest } from '@/supabase/dal';
import { categorySchema } from '@/app/(protected)/categories/_types';

export default async function SettingsCategoriesPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/categories');
      return categorySchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesClient />
    </HydrationBoundary>
  );
}
