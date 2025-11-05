'use client';

import { AddedBook } from '@/app/(protected)/lists/_types';
import AddedBookItem from '@/app/(protected)/lists/_components/display/AddedBookItem';
import EmptyState from '@/components/EmptyState';
import { ListBook } from '@/app/(protected)/listBooks/_types';

interface AddedBooksViewProps {
  books: AddedBook[];
  listBooks: ListBook[];
}

export default function AddedBooksView({ books, listBooks }: AddedBooksViewProps) {
  return (
    <section className="space-y-4">
      {/* 見出し */}
      <h3 className="text-lg font-semibold text-gray-900">追加済みの本</h3>

      {/* 本のリスト */}
      {books.length === 0 ? (
        <EmptyState element="本" context="detail" />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          {books.map((book) => {
            const listBook = listBooks.find((lb) => lb.book_id === book.id);
            if (!listBook) return null;

            return <AddedBookItem key={book.id} book={book} listBookId={listBook.id} />;
          })}
        </div>
      )}
    </section>
  );
}
