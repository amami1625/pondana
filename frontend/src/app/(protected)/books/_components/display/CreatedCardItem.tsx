'use client';

import { Card } from '@/app/(protected)/cards/_types';
import { DeleteButton } from '@/components/buttons';
import ErrorMessage from '@/components/ErrorMessage';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import { DetailLink } from '@/components/links';

interface CreatedCardItemProps {
  card: Card;
}

export default function CreatedCardItem({ card }: CreatedCardItemProps) {
  const { deleteCard, deleteError } = useCardMutations();

  const handleDelete = () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    if (card) {
      deleteCard({ bookId: card.book_id, cardId: card.id });
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      {/* エラーメッセージ */}
      {deleteError && <ErrorMessage message={deleteError.message} />}

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{card.title}</h3>

          {/* 本文 */}
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{card.content}</p>
        </div>

        {/* アクションボタン */}
        <div className="flex-shrink-0 flex gap-2">
          <DetailLink href={`/cards/${card.id}`} />
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
}
