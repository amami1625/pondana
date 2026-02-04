'use client';

import { BookDetail } from '@/app/(protected)/books/_types';
import { useBookDetailView } from '@/app/(protected)/books/_hooks/useBookDetailView';
import UpdateBookFormModal from '@/app/(protected)/books/_components/modal';
import AddListModal from '@/app/(protected)/listBooks/_components/modal/AddListModal';
import CardModal from '@/app/(protected)/cards/_components/modal';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import BookActions from '@/app/(protected)/books/_components/detail/BookActions';
import BookDetailTabs from '@/app/(protected)/books/_components/detail/tab/BookDetailTabs';
import { useProfile } from '@/hooks/useProfile';

interface BookDetailProps {
  book: BookDetail;
}

export default function BookDetailView({ book }: BookDetailProps) {
  const { breadcrumbItems, badges, handleDelete, updateModal, addListModal, cardModal } =
    useBookDetailView(book);
  const { data: profile } = useProfile();

  // ログインユーザーが本の所有者かどうかを判定
  const isOwner = profile?.id === book.user_id;

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* パンくずリスト */}
        <Breadcrumb items={breadcrumbItems} />
        {/* メインカード */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
          {book.thumbnail && (
            <Image
              src={book.thumbnail}
              alt={book.title}
              width={128}
              height={176}
              className="w-32 h-44 shrink-0 object-cover rounded-lg"
              priority
            />
          )}
          <div className="flex flex-col gap-4 min-w-0">
            {/* タイトル・著者情報 */}
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter line-clamp-2 sm:line-clamp-1">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-slate-500 text-lg font-medium line-clamp-1">{book.subtitle}</p>
              )}
              {book.authors && (
                <p className="text-slate-500 text-lg font-medium line-clamp-1">
                  {`著者: ${book.authors.join(', ')}`}
                </p>
              )}
            </div>

            {/* バッジ */}
            {badges && <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">{badges}</div>}

            {/* 評価 */}
            {book.rating && (
              <div className="flex items-center gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < book.rating! ? 'fill-current' : ''}`} />
                ))}
              </div>
            )}

            {/* 説明 */}
            <p className="text-slate-600 text-base leading-relaxed">
              {book.description ?? '説明が登録されていません'}
            </p>

            {/* メタデータ */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
              <span>登録日: {book.created_at}</span>
              <span>更新日: {book.updated_at}</span>
            </div>

            {/* アクションボタン（所有者のみ） */}
            {isOwner && (
              <BookActions
                onEdit={updateModal.open}
                onAddToList={addListModal.open}
                onCreateCard={cardModal.open}
                onDelete={() => handleDelete(book.id)}
              />
            )}
          </div>
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
