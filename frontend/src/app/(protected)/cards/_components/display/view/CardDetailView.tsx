'use client';

import CardModal from '@/app/(protected)/cards/_components/modal';
import { useCardDetailView } from '@/app/(protected)/cards/_hooks/useCardDetailView';
import { CardDetail } from '@/app/(protected)/cards/_types/index';
import {
  DetailContainer,
  DetailCard,
  DetailHeader,
  DetailDescription,
  DetailMetadata,
} from '@/components/details';
import CardActions from '@/app/(protected)/cards/_components/detail/CardActions';

interface CardDetailViewProps {
  card: CardDetail;
}

export default function CardDetailView({ card }: CardDetailViewProps) {
  const { breadcrumbItems, subtitle, handleDelete, updateModal } = useCardDetailView(card);

  return (
    <>
      <DetailContainer breadcrumbItems={breadcrumbItems}>
        <DetailCard>
          <DetailHeader title={card.title} subtitle={subtitle} />
          <DetailDescription>{card.content}</DetailDescription>
          <DetailMetadata createdAt={card.created_at} updatedAt={card.updated_at} />
          <CardActions
            onEdit={updateModal.open}
            onDelete={() => handleDelete(card.book_id, card.id)}
          />
        </DetailCard>
      </DetailContainer>

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
