import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { authenticatedRequest } from '@/supabase/dal';
import { tagSchema } from '@/schemas/tag';
import TagsClient from '@/app/(protected)/settings/_components/clients/TagsClient';

export default async function SettingsTagsPage() {
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tags.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/tags');
      return tagSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagsClient />
    </HydrationBoundary>
  );
}
