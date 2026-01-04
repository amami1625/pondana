'use client';

import BookSearch from '@/app/(protected)/books/search/_components/BookSearch';
import BookSelected from '@/app/(protected)/books/search/_components/BookSelected';
import { useModal } from '@/hooks/useModal';
import UsageGuideModal from '@/app/(protected)/books/search/_components/modal';
import Button from '@/components/buttons/Button';
import { Lightbulb } from 'lucide-react';
import { useBookSearchPage } from '@/app/(protected)/books/search/_hooks/useBookSearchPage';
import PageTitle from '@/components/layout/PageTitle';

export default function BookSearchPage() {
  const { selectedBook, handleSelectBook, handleClearSelection } = useBookSearchPage();
  const { isOpen, open, close } = useModal();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <PageTitle title="書籍検索" />
        <p className="text-gray-600">書籍名、著者名で検索して、書籍を登録できます。</p>
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
