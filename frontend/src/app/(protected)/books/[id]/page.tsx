import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchBook } from '@/app/(protected)/books/_lib/fetchBook';
import BookDetailClient from '@/app/(protected)/books/_components/clients/BookDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const bookId = Number(id);

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.books.detail(bookId),
    queryFn: () => fetchBook(bookId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookDetailClient id={bookId} />
    </HydrationBoundary>
  );
}
