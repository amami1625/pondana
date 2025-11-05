import { Book } from '@/app/(protected)/books/_types';
import BookForm from '@/app/(protected)/books/_components/forms';
import BaseModal from '@/components/BaseModal';

interface BookFormModalProps {
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookFormModal({ book, isOpen, onClose }: BookFormModalProps) {
  const title = book ? '本を編集' : '本を作成';
  const submitLabel = book ? '更新' : '作成';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <BookForm book={book} submitLabel={submitLabel} cancel={onClose} />
    </BaseModal>
  );
}
