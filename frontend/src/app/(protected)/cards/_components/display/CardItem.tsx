'use client';

import { Card } from '@/app/(protected)/cards/_types';
import { DeleteButton } from '@/components/buttons';
import { DetailLink } from '@/components/links';
import ErrorMessage from '@/components/ErrorMessage';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import { useRouter } from 'next/navigation';

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const router = useRouter();
  const { deleteCard, deleteError } = useCardMutations();

  const handleDelete = () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    if (card) {
      deleteCard(
        { bookId: card.book_id, cardId: card.id },
        {
          onSuccess: () => {
            router.push('/cards');
          },
        },
      );
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
