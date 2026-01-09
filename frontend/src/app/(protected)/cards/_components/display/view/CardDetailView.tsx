'use client';

import CardModal from '@/app/(protected)/cards/_components/modal';
import { useCardDetailView } from '@/app/(protected)/cards/_hooks/useCardDetailView';
import { CardDetail } from '@/app/(protected)/cards/_types/index';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CardActions from '@/app/(protected)/cards/_components/detail/CardActions';
import StatusBadge from '@/components/badges/StatusBadge';

interface CardDetailViewProps {
  card: CardDetail;
}

export default function CardDetailView({ card }: CardDetailViewProps) {
  const { breadcrumbItems, handleDelete, updateModal } = useCardDetailView(card);

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* パンくずリスト */}
        <Breadcrumb items={breadcrumbItems} />
        {/* メインカード */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
          <div className="flex flex-1 flex-col gap-6 min-w-0">
            {/* ヘッダー */}
          <div className="flex flex-wrap justify-between items-start gap-4 min-w-0">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter truncate">
                {card.title}
              </h1>
              <p className="text-slate-500 text-lg font-medium truncate">{card.book.title}</p>
            </div>
            {card.status && (
              <div className="flex items-center gap-3">
                <StatusBadge label={card.status.name} />
              </div>
            )}
          </div>
          {/* 説明 */}
          <p className="text-slate-600 text-base font-normal leading-relaxed">
            {card.content ?? '説明が登録されていません'}
          </p>

          {/* メタデータ */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
            <span>登録日: {card.created_at}</span>
            <span>更新日: {card.updated_at}</span>
          </div>
          <CardActions
            onEdit={updateModal.open}
            onDelete={() => handleDelete(card.book_id, card.id)}
            id={card.book_id}
          />
          </div>
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
