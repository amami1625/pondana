import BaseModal from '@/components/BaseModal';
import NameForm from '../forms/NameForm';
import { User } from '@/schemas/user';

interface UserFormModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserFormModal({ user, isOpen, onClose }: UserFormModalProps) {
  return (
    <BaseModal title="ユーザー名を変更" isOpen={isOpen} onClose={onClose}>
      <NameForm user={user} onClose={onClose} />
    </BaseModal>
  );
}
