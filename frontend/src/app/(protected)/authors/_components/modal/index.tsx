import { Author } from '@/app/(protected)/authors/_types';
import AuthorForm from '@/app/(protected)/authors/_components/forms';
import BaseModal from '@/components/modals/BaseModal';

interface AuthorModalProps {
  author?: Author;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthorModal({ author, isOpen, onClose }: AuthorModalProps) {
  const title = author ? '著者を編集' : '著者を追加';
  const submitLabel = author ? '更新' : '追加';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <AuthorForm author={author} submitLabel={submitLabel} cancel={onClose} />
    </BaseModal>
  );
}
