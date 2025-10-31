import { Author } from '@/app/(protected)/authors/_types';
import AuthorForm from '@/app/(protected)/authors/_components/forms';
import BaseModal from '@/components/BaseModal';
import { createAuthor, updateAuthor } from '@/app/(protected)/authors/_lib/actions';

interface AuthorModalProps {
  author?: Author;
  isOpen: boolean;
  onClose: () => void;
  setCreatedAuthors: React.Dispatch<React.SetStateAction<Author[]>>;
}

export default function AuthorModal({
  author,
  isOpen,
  onClose,
  setCreatedAuthors,
}: AuthorModalProps) {
  const title = author ? '著者を編集' : '著者を追加';
  const action = author ? updateAuthor : createAuthor;
  const submitLabel = author ? '更新' : '追加';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <AuthorForm
        author={author}
        action={action}
        submitLabel={submitLabel}
        cancel={onClose}
        setCreatedAuthors={setCreatedAuthors}
      />
    </BaseModal>
  );
}
