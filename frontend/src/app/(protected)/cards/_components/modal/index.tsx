import BaseModal from '@/components/modals/BaseModal';
import ModalInfo from '@/components/modals/ModalInfo';
import CardForm from '@/app/(protected)/cards/_components/form';
import { Card } from '@/app/(protected)/cards/_types';

interface CardModalProps {
  card?: Card;
  bookId: string;
  bookTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardModal({ card, bookId, bookTitle, isOpen, onClose }: CardModalProps) {
  return (
    <BaseModal title={card ? 'カードを更新' : 'カードを作成'} isOpen={isOpen} onClose={onClose}>
      <ModalInfo label="書籍名" content={bookTitle} />
      <CardForm
        card={card}
        bookId={bookId}
        submitLabel={card ? '更新' : '作成'}
        onClose={onClose}
      />
    </BaseModal>
  );
}
