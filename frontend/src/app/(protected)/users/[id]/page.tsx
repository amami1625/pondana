import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import UserDetailClient from '@/app/(protected)/users/_components/clients/UserDetailClient';
import { authenticatedRequest } from '@/supabase/dal';
import { userWithStatsSchema } from '@/app/(protected)/users/_types';
import { bookSchema } from '@/app/(protected)/books/_types';
import { listSchema } from '@/app/(protected)/lists/_types';

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
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

  // ユーザーの公開本一覧をprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.books(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/users/${id}/books`);
      return bookSchema.array().parse(data);
    },
  });

  // ユーザーの公開リスト一覧をprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.lists(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/users/${id}/lists`);
      return listSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDetailClient id={id} />
    </HydrationBoundary>
  );
}
