import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { authenticatedRequest } from '@/supabase/dal';
import { userWithStatsSchema } from '@/app/(protected)/users/_types';
import { userSchema } from '@/schemas/user';
import FollowersClient from '@/app/(protected)/users/_components/clients/FollowersClient';

interface FollowersPageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  // ユーザー情報をprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/users/${id}`);
      return userWithStatsSchema.parse(data);
    },
  });

  // フォロワー一覧をprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.followers(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/users/${id}/followers`);
      return userSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FollowersClient id={id} />
    </HydrationBoundary>
  );
}
