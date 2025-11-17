'use client';

import CardModal from '@/app/(protected)/cards/_components/modal';
import { useModal } from '@/hooks/useModal';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import { useRouter } from 'next/navigation';
import { CardDetail } from '@/app/(protected)/cards/_types/index';
import { getCardDetailBreadcrumbs } from '@/lib/utils';
import Breadcrumb from '@/components/Breadcrumb';
import CardActions from '@/app/(protected)/cards/_components/detail/CardActions';

interface CardDetailViewProps {
  card: CardDetail;
}

export default function CardDetailView({ card }: CardDetailViewProps) {
  const router = useRouter();
  const { deleteCard } = useCardMutations();
  const updateModal = useModal();

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

  const breadcrumbItems = getCardDetailBreadcrumbs(card.title);

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* パンくずリスト */}
        <Breadcrumb items={breadcrumbItems} />

        {/* カード情報 */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
          {/* ヘッダー */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              {/* タイトル */}
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter">
                {card.title}
              </h1>
              {/* 書籍名 */}
              <p className="text-slate-500 text-lg font-medium">書籍名: {card.book.title}</p>
            </div>
          </div>

          {/* 説明文 */}
          <p className="text-slate-600 text-base font-normal leading-relaxed">{card.content}</p>

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
            <span>登録日: {card.created_at}</span>
            <span>更新日: {card.updated_at}</span>
          </div>

          {/* アクションボタン */}
          <CardActions onEdit={updateModal.open} onDelete={handleDelete} />
        </div>
      </div>

      <CardModal
        card={card}
        bookId={card.book_id}
        bookTitle={card.book.title}
        isOpen={updateModal.isOpen}
        onClose={updateModal.close}
      />
    </>
  );
}
