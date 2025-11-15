'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Book } from '@/app/(protected)/books/_types';
import { useModal } from '@/hooks/useModal';
import BookListCard from '@/app/(protected)/books/_components/display/BookListCard';
import CategoryFilter from '@/app/(protected)/books/_components/filters/CategoryFilter';
import CreateBookFormModal from '@/app/(protected)/books/_components/modal';
import Button from '@/components/buttons/Button';
import EmptyState from '@/components/EmptyState';

interface BookIndexViewProps {
  books: Book[];
}

export default function BookIndexView({ books }: BookIndexViewProps) {
  const createModal = useModal();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ユニークなカテゴリ一覧を取得
  const categories = useMemo(() => {
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
    if (!selectedCategory) {
      return books;
    }
    return books.filter((book) => book.category?.name === selectedCategory);
  }, [books, selectedCategory]);

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
            <Button variant="create" onClick={createModal.open} icon={<Plus className="h-4 w-4" />}>
              本を追加
            </Button>
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
