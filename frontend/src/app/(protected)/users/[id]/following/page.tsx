import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { authenticatedRequest } from '@/supabase/dal';
import { userWithStatsSchema, userSchema } from '@/app/(protected)/users/_types';
import FollowingClient from '@/app/(protected)/users/_components/clients/FollowingClient';

interface FollowingPageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
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

  // フォロー中のユーザー一覧をprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.following(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/users/${id}/following`);
      return userSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FollowingClient id={id} />
    </HydrationBoundary>
  );
}
