import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchBooks } from '@/app/(protected)/books/_lib/fetchBooks';
import BooksClient from '@/app/(protected)/books/_components/clients/BooksClient';

export default async function BooksPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.books.all,
    queryFn: fetchBooks,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BooksClient />
    </HydrationBoundary>
  );
}
