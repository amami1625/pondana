'use client';

import { useBook } from '@/app/(protected)/books/_hooks/useBook';
import BookDetailView from '@/app/(protected)/books/_components/display/view/BookDetailView';
import QueryBoundary from '@/components/data/QueryBoundary';

interface BookDetailClientProps {
  id: string;
}

export default function BookDetailClient({ id }: BookDetailClientProps) {
  const query = useBook(id);

  return (
    <QueryBoundary {...query} loadingMessage="本情報を読み込んでいます...">
      {(book) => <BookDetailView book={book} />}
    </QueryBoundary>
  );
}
