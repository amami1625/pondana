'use client';

import { Book } from '@/schemas/book';
import BookListCard from '@/app/(protected)/books/_components/display/BookListCard';

interface UserBooksViewProps {
  books: Book[];
}

export default function UserBooksView({ books }: UserBooksViewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">本一覧</h2>
      {books.length === 0 ? (
        <p className="text-slate-500 text-center py-8">公開している本はありません</p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <BookListCard key={book.id} book={book} showDetailLink={false} />
          ))}
        </div>
      )}
    </div>
  );
}
