import { Book } from '@/app/(protected)/books/_types';
import { Author } from '@/app/(protected)/authors/_types';
import { Category } from '@/app/(protected)/categories/_types';
import BookForm from '@/app/(protected)/books/_components/forms';
import BaseModal from '@/components/BaseModal';

interface BookFormModalProps {
  book?: Book;
  authors: Author[];
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export default function BookFormModal({
  book,
  authors,
  categories,
  isOpen,
  onClose,
}: BookFormModalProps) {
  const title = book ? '本を編集' : '本を作成';
  const submitLabel = book ? '更新' : '作成';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <BookForm
        book={book}
        authors={authors}
        categories={categories}
        submitLabel={submitLabel}
        cancel={onClose}
      />
    </BaseModal>
  );
}
