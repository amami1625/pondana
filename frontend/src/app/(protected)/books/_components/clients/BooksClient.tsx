'use client';

import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';
import QueryBoundary from '@/components/data/QueryBoundary';
import BookIndexView from '@/app/(protected)/books/_components/display/view/BookIndexView';

export default function BooksClient() {
  const query = useBooks();

  return (
    <QueryBoundary {...query} loadingMessage="本一覧を読み込んでいます">
      {(books) => <BookIndexView books={books} />}
    </QueryBoundary>
  );
}
