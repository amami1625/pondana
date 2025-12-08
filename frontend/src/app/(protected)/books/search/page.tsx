'use client';

import {
  BookSearchAutocomplete,
  SelectedBookDetail,
  UsageGuide,
} from '@/app/(protected)/books/search/_components';
import { useBookSearchPage } from '@/app/(protected)/books/search/_hooks/useBookSearchPage';

export default function BookSearchPage() {
  const { selectedBook, handleSelectBook, handleClearSelection } = useBookSearchPage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">書籍検索</h1>
        <p className="text-gray-600">書籍名、著者名、ISBNで検索して、書籍を登録できます。</p>
      </div>

      {/* オートコンプリート検索 */}
      <BookSearchAutocomplete onSelectBook={handleSelectBook} />

      {/* 選択された書籍の詳細表示 */}
      {selectedBook && <SelectedBookDetail book={selectedBook} onClear={handleClearSelection} />}

      {/* 使い方ガイド */}
      {!selectedBook && <UsageGuide />}
    </div>
  );
}
