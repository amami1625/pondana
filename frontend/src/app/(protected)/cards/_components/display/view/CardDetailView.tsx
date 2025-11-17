'use client';

import CardModal from '@/app/(protected)/cards/_components/modal';
import { useModal } from '@/hooks/useModal';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import { useRouter } from 'next/navigation';
import { CardDetail } from '@/app/(protected)/cards/_types/index';
import { getCardDetailBreadcrumbs } from '@/lib/utils';
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
      <DetailContainer breadcrumbItems={breadcrumbItems}>
        <DetailCard>
          <DetailHeader
            title={card.title}
            subtitle={`書籍名: ${card.book.title}`}
          />
          <DetailDescription>{card.content}</DetailDescription>
          <DetailMetadata createdAt={card.created_at} updatedAt={card.updated_at} />
          <CardActions onEdit={updateModal.open} onDelete={handleDelete} />
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
