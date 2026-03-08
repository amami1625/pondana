import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import ListDetailClient from '@/app/(protected)/lists/_components/clients/ListDetailClient';
import { authenticatedRequest } from '@/supabase/dal';
import { listDetailSchema } from '@/app/(protected)/lists/_types';
import { userSchema } from '@/schemas/user';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListPage({ params }: Props) {
  const { id } = await params;

  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.lists.detail(id),
      queryFn: async () => {
        const data = await authenticatedRequest(`/lists/${id}`);
        return listDetailSchema.parse(data);
      },
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.profile.all,
      queryFn: async () => {
        const data = await authenticatedRequest('/profile');
        return userSchema.parse(data);
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListDetailClient id={id} />
    </HydrationBoundary>
  );
}
