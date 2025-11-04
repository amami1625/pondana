'use client';

import PageTitle from '@/components/PageTitle';
import ErrorMessage from '@/components/ErrorMessage';
import { useBooks } from './_hooks/useBooks';
import { useAuthors } from '../authors/_hooks/useAuthors';
import { useCategories } from '../categories/_hooks/useCategories';
import { CreateButton } from '@/components/Buttons';
import { useModal } from '@/hooks/useModal';
import EmptyState from '@/components/EmptyState';
import BookCard from './_components/display/BookCard';
import CreateBookFormModal from '@/app/(protected)/books/_components/modal';
import LoadingState from '@/components/LoadingState';

export default function BooksPage() {
  const { data: books, error: bookError, isLoading: bookLoading } = useBooks();
  const { data: authors, error: authorError, isLoading: authorLoading } = useAuthors();
  const { data: categories, error: categoryError, isLoading: categoryLoading } = useCategories();
  const createModal = useModal();

  // ローディング状態
  if (bookLoading || authorLoading || categoryLoading) {
    return <LoadingState message="本一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError || authorError || categoryError) {
    return (
      <ErrorMessage
        message={
          bookError?.message ||
          authorError?.message ||
          categoryError?.message ||
          'エラーが発生しました'
        }
      />
    );
  }

  // データが取得できていない場合
  if (!books || !authors || !categories) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return (
    <>
      <PageTitle title="本一覧" />
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
