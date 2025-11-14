'use client';

import { useState, useMemo } from 'react';
import BookListCard from '@/app/(protected)/books/_components/display/BookListCard';
import CategoryFilter from '@/app/(protected)/books/_components/filters/CategoryFilter';
import CreateBookFormModal from '@/app/(protected)/books/_components/modal';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import { CreateButton } from '@/components/buttons';
import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';
import { useModal } from '@/hooks/useModal';

export default function BooksPage() {
  const { data: books, error: bookError, isLoading: bookLoading } = useBooks();
  const createModal = useModal();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ユニークなカテゴリ一覧を取得
  const categories = useMemo(() => {
    if (!books) return [];
    const categorySet = new Set<string>();
    books.forEach((book) => {
      if (book.category?.name) {
        categorySet.add(book.category.name);
      }
    });
    return Array.from(categorySet).sort();
  }, [books]);

  // フィルタリングされた書籍リスト
  const filteredBooks = useMemo(() => {
    if (!books) return [];
    if (!selectedCategory) {
      return books;
    }
    return books.filter((book) => book.category?.name === selectedCategory);
  }, [books, selectedCategory]);

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
    <div className="max-w-4xl mx-auto">
      {/* ページヘッダー */}
      <header className="mb-6">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">
              本棚
            </h1>
            <p className="text-slate-500 text-base font-normal leading-normal">
              登録した本を管理できます
            </p>
          </div>
          <div className="flex items-end">
            <CreateButton onClick={createModal.open}>本を追加</CreateButton>
          </div>
        </div>
      </header>

      {books.length === 0 ? (
        // 本が登録されていない場合の表示
        <EmptyState element="本" />
      ) : (
        <>
          {/* カテゴリフィルター */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* 本のリスト表示 */}
          <div className="flex flex-col gap-4 mt-6">
            {filteredBooks.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                このカテゴリに該当する本がありません
              </p>
            ) : (
              filteredBooks.map((book) => <BookListCard key={book.id} book={book} />)
            )}
          </div>
        </>
      )}

      <CreateBookFormModal isOpen={createModal.isOpen} onClose={createModal.close} />
    </div>
  );
}
