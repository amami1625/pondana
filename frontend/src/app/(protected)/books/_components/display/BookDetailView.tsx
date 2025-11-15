'use client';

import UpdateBookFormModal from '@/app/(protected)/books/_components/modal';
import AddListModal from '@/app/(protected)/listBooks/_components/modal/AddListModal';
import CardModal from '@/app/(protected)/cards/_components/modal';
import { useModal } from '@/hooks/useModal';
import { useBook } from '@/app/(protected)/books/_hooks/useBook';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';
import Breadcrumb from '@/components/Breadcrumb';
import { getBookDetailBreadcrumbs } from '@/lib/utils';
import CategoryBadge from '@/app/(protected)/books/_components/detail/badge/CategoryBadge';
import PublicBadge from '@/app/(protected)/books/_components/detail/badge/PublicBadge';
import BookActions from '@/app/(protected)/books/_components/detail/BookActions';
import BookDetailTabs from '@/app/(protected)/books/_components/detail/tab/BookDetailTabs';

interface BookDetailProps {
  id: number;
}

export default function BookDetailView({ id }: BookDetailProps) {
  const { data: book, error: bookError, isLoading: bookLoading } = useBook(id);
  const { deleteBook } = useBookMutations();
  const updateModal = useModal();
  const addListModal = useModal();
  const cardModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteBook(id);
  };

  // ローディング状態
  if (bookLoading) {
    return <LoadingState message="本情報を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError) {
    return <ErrorMessage message={bookError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!book) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  // パンくずリストのアイテム
  const breadcrumbItems = getBookDetailBreadcrumbs(book.title);

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* パンくずリスト */}
        <Breadcrumb items={breadcrumbItems} />

        {/* 書籍情報カード */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
          {/* ヘッダー: タイトル・著者・バッジ */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter">
                {book.title}
              </h1>
              {book.authors && book.authors.length > 0 && (
                <p className="text-slate-500 text-lg font-medium">
                  {book.authors.map((author) => author.name).join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {book.category && <CategoryBadge label={book.category.name} />}
              <PublicBadge isPublic={book.public} />
            </div>
          </div>

          {/* 説明文 */}
          <p className="text-slate-600 text-base font-normal leading-relaxed">
            {book.description || '説明が登録されていません。'}
          </p>

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
            <span>登録日: {book.created_at}</span>
            <span>更新日: {book.updated_at}</span>
          </div>

          {/* アクションボタン */}
          <BookActions
            onEdit={updateModal.open}
            onAddToList={addListModal.open}
            onCreateCard={cardModal.open}
            onDelete={() => handleDelete(id)}
          />
        </div>

        {/* タブ切り替え */}
        <BookDetailTabs lists={book.lists} cards={book.cards} />
      </div>

      {/* モーダル */}
      <UpdateBookFormModal book={book} isOpen={updateModal.isOpen} onClose={updateModal.close} />
      <AddListModal
        bookId={book.id}
        listIds={book.lists.map((list) => list.id)}
        isOpen={addListModal.isOpen}
        onClose={addListModal.close}
      />
      <CardModal
        bookId={book.id}
        bookTitle={book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </>
  );
}
