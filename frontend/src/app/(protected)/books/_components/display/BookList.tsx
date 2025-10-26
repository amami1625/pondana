'use client';

import { Book } from '@/app/(protected)/books/_types';
import { Author } from '@/app/(protected)/authors/_types';
import { Category } from '@/app/(protected)/categories/_types';

import BookCard from './BookCard';
import { useModal } from '@/hooks/useModal';
import CreateBookFormModal from '@/app/(protected)/books/_components/modal';
import { CreateButton } from '@/components/Buttons';
import EmptyState from '@/components/EmptyState';

interface BookListProps {
  books: Book[];
  authors: Author[];
  categories: Category[];
}

export default function BookList({ books, authors, categories }: BookListProps) {
  const createModal = useModal();

  return (
    <>
      <div className="mb-6 flex justify-end">
        <CreateButton onClick={createModal.open} />
      </div>
      {books.length === 0 ? (
        // 本が登録されていない場合の表示
        <EmptyState element="本" />
      ) : (
        // 本のリスト表示
        <div className="space-y-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
      <CreateBookFormModal
        authors={authors}
        categories={categories}
        isOpen={createModal.isOpen}
        onClose={createModal.close}
      />
    </>
  );
}
