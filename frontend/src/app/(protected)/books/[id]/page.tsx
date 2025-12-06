import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import BookDetailClient from '@/app/(protected)/books/_components/clients/BookDetailClient';
import { authenticatedRequest } from '@/supabase/dal';
import { bookDetailSchema } from '@/app/(protected)/books/_types/';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: Props) {
  const { id } = await params;

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/books/${id}`);
      return bookDetailSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookDetailClient id={id} />
    </HydrationBoundary>
  );
}
