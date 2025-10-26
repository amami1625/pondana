'use client';

import { CardDetail } from '@/app/(protected)/cards/_types';
import CardModal from '@/app/(protected)/cards/_components/modal';
import { DeleteButton, UpdateButton } from '@/components/Buttons';
import { useModal } from '@/hooks/useModal';
import { useDeleteCard } from '@/app/(protected)/cards/_hooks/useDeleteCard';
import { updateCard } from '@/app/(protected)/cards/_lib/actions';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  DetailMetadata,
  DetailMetadataItem,
  DetailActions,
} from '@/components/details';

interface CardDetailViewProps {
  card: CardDetail;
}

export default function CardDetailView({ card }: CardDetailViewProps) {
  const { error, handleDelete } = useDeleteCard({
    cardId: card.id,
    bookId: card.book_id,
    redirectTo: '/cards',
  });

  const cardModal = useModal();

  return (
    <>
      <DetailContainer error={error}>
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
          <UpdateButton onClick={cardModal.open} />
          <DeleteButton onClick={handleDelete} />
        </DetailActions>
      </DetailContainer>

      <CardModal
        card={card}
        action={updateCard}
        bookId={card.book_id}
        bookTitle={card.book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </>
  );
}
