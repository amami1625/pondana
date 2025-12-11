'use client';

import BookSearch from '@/app/(protected)/books/search/_components/BookSearch';
import BookSelected from '@/app/(protected)/books/search/_components/BookSelected';
import { useModal } from '@/hooks/useModal';
import UsageGuideModal from '@/app/(protected)/books/search/_components/modal';
import Button from '@/components/buttons/Button';
import { Lightbulb } from 'lucide-react';
import { useBookSearchPage } from '@/app/(protected)/books/search/_hooks/useBookSearchPage';

export default function BookSearchPage() {
  const { selectedBook, handleSelectBook, handleClearSelection } = useBookSearchPage();
  const { isOpen, open, close } = useModal();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">書籍検索</h1>
        <p className="text-gray-600">書籍名、著者名、ISBNで検索して、書籍を登録できます。</p>
        <Button variant="primary" onClick={open} icon={<Lightbulb />}>
          使い方
        </Button>
      </div>

      {/* オートコンプリート検索 */}
      <BookSearch onSelectBook={handleSelectBook} />

      {/* 選択された書籍の詳細表示 */}
      {selectedBook && <BookSelected book={selectedBook} onClear={handleClearSelection} />}

      {/* 使い方ガイド */}
      {isOpen && <UsageGuideModal isOpen={isOpen} onClose={close} />}
    </div>
  );
}
