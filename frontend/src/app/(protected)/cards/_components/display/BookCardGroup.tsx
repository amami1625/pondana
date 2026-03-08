'use client';

import { useState } from 'react';
import { Card } from '@/app/(protected)/cards/_types';
import CardItem from '@/app/(protected)/cards/_components/display/CardItem';
import CardModal from '@/app/(protected)/cards/_components/modal';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useModal } from '@/hooks/useModal';

interface BookCardGroupProps {
  book: {
    id: string;
    title: string;
  };
  cards: Card[];
}

export default function BookCardGroup({ book, cards }: BookCardGroupProps) {
  const cardModal = useModal();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="space-y-3">
      {/* 本のタイトルと作成ボタン */}
      <div className="flex items-center gap-2 max-w-full">
        <button
          onClick={toggleExpand}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
          data-testid="expand"
          aria-label={isExpanded ? 'カードリストを折りたたむ' : 'カードリストを展開する'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>

        <h2 className="text-lg font-bold text-gray-900 truncate min-w-0">{book.title}</h2>

        <span className="text-sm text-gray-500 flex-shrink-0">({cards.length}枚)</span>

        <button
          onClick={cardModal.open}
          className="flex-shrink-0 ml-auto p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          aria-label="カードを作成"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* カードのリスト（アコーディオン） */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {cards.length === 0 ? (
          <p className="text-sm text-gray-500 pl-8 py-2">
            この本にはまだカードが登録されていません
          </p>
        ) : (
          <div className="space-y-3 pl-8">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>

      {/* カード作成モーダル */}
      <CardModal
        bookId={book.id}
        bookTitle={book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </section>
  );
}
