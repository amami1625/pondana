'use client';

import { Plus } from 'lucide-react';
import { Book } from '@/app/(protected)/books/_types';
import BookListCard from '@/app/(protected)/books/_components/display/BookListCard';
import Filter from '@/components/filters/Filter';
import EmptyState from '@/components/feedback/EmptyState';
import Link from 'next/link';
import { useBookIndexView } from '@/app/(protected)/books/_hooks/useBookIndexView';

interface BookIndexViewProps {
  books: Book[];
}

export default function BookIndexView({ books }: BookIndexViewProps) {
  const { selectedCategory, setSelectedCategory, categories, filteredBooks } =
    useBookIndexView(books);

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
            <Link
              href="/books/search"
              className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold transition-colors cursor-pointer gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              本を追加
            </Link>
          </div>
        </div>
      </header>

      {books.length === 0 ? (
        // 本が登録されていない場合の表示
        <EmptyState element="本" />
      ) : (
        <>
          {/* カテゴリフィルター */}
          <Filter
            items={categories}
            selectedItem={selectedCategory}
            onSelectItem={setSelectedCategory}
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
    </div>
  );
}
