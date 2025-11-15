'use client';

import CardModal from '@/app/(protected)/cards/_components/modal';
import Button from '@/components/buttons/Button';
import { useModal } from '@/hooks/useModal';
import { useCard } from '@/app/(protected)/cards/_hooks/useCard';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  DetailMetadata,
  DetailMetadataItem,
  DetailActions,
} from '@/components/details';
import { useRouter } from 'next/navigation';

interface CardDetailViewProps {
  id: number;
}

export default function CardDetailView({ id }: CardDetailViewProps) {
  const router = useRouter();
  const { data: card, error: cardError, isLoading: cardLoading } = useCard(id);
  const { deleteCard, deleteError } = useCardMutations();
  const cardModal = useModal();

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

  // ローディング状態
  if (cardLoading) {
    return <LoadingState message="カード情報を読み込んでいます..." />;
  }

  // エラー状態
  if (cardError) {
    return <ErrorMessage message={cardError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!card) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return (
    <>
      <DetailContainer error={deleteError?.message}>
        <DetailHeader title={card.title} />

        <DetailSection title="本文">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
            {card.content}
          </p>
        </DetailSection>

        <DetailMetadata>
          <DetailMetadataItem label="書籍名" value={card.book.title} />
          <DetailMetadataItem label="更新日" value={card.updated_at} />
          <DetailMetadataItem label="登録日" value={card.created_at} />
          <DetailMetadataItem label="ID" value={`#${card.id}`} />
        </DetailMetadata>

        <DetailActions>
          <Button variant="update" onClick={cardModal.open}>
            編集
          </Button>
          <Button variant="delete" onClick={handleDelete}>
            削除
          </Button>
        </DetailActions>
      </DetailContainer>

      <CardModal
        card={card}
        bookId={card.book_id}
        bookTitle={card.book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </>
  );
}
