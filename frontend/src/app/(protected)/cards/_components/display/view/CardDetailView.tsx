'use client';

import CardModal from '@/app/(protected)/cards/_components/modal';
import Button from '@/components/buttons/Button';
import { useModal } from '@/hooks/useModal';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  DetailMetadata,
  DetailMetadataItem,
  DetailActions,
} from '@/components/details';
import { useRouter } from 'next/navigation';
import { CardDetail } from '@/app/(protected)/cards/_types/index';

interface CardDetailViewProps {
  card: CardDetail;
}

export default function CardDetailView({ card }: CardDetailViewProps) {
  const router = useRouter();
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
