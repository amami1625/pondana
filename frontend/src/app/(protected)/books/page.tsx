import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import BooksClient from '@/app/(protected)/books/_components/clients/BooksClient';
import { authenticatedRequest } from '@/supabase/dal';
import { bookSchema } from '@/app/(protected)/books/_types/';

export default async function BooksPage() {
  const queryClient = createServerQueryClient();

  // サーバー側でデータをprefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.books.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/books');
      return bookSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BooksClient />
    </HydrationBoundary>
  );
}
