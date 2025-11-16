'use client';

import { AddedBook } from '@/app/(protected)/lists/_types';
import { ListBook } from '@/app/(protected)/listBooks/_types';
import AddedBookItem from '@/app/(protected)/lists/_components/display/AddedBookItem';
import EmptyState from '@/components/EmptyState';

interface AddedBooksProps {
  books: AddedBook[];
  listBooks: ListBook[];
}

export default function AddedBooks({ books, listBooks }: AddedBooksProps) {
  return (
    <section className="space-y-4">
      {/* 見出し */}
      <div className="border-b border-slate-200">
        <h3 className="text-lg font-semibold text-gray-900 pb-3">追加済みの本</h3>
      </div>

      {/* 本のリスト */}
      {books.length === 0 ? (
        <EmptyState element="本" context="detail" />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
