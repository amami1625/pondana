'use client';

import BookCard from '@/app/(protected)/books/_components/display/BookCard';
import CreateBookFormModal from '@/app/(protected)/books/_components/modal';
import PageTitle from '@/components/PageTitle';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import { CreateButton } from '@/components/Buttons';
import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';
import { useModal } from '@/hooks/useModal';

export default function BooksPage() {
  const { data: books, error: bookError, isLoading: bookLoading } = useBooks();
  const createModal = useModal();

  // ローディング状態
  if (bookLoading) {
    return <LoadingState message="本一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError) {
    return <ErrorMessage message={bookError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!books) {
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
      <CreateBookFormModal isOpen={createModal.isOpen} onClose={createModal.close} />
    </>
  );
}
