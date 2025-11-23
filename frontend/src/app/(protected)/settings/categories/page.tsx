import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import CategoriesClient from '@/app/(protected)/settings/_components/clients/CategoriesClient';
import { fetchCategories } from '@/app/(protected)/categories/_lib/fetchCategories';

export default async function SettingsCategoriesPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.authors.all,
    queryFn: fetchCategories,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesClient />
    </HydrationBoundary>
  );
}
