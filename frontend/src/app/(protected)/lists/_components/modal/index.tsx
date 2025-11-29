import BaseModal from '@/components/modals/BaseModal';
import ListForm from '@/app/(protected)/lists/_components/form';
import { List } from '@/app/(protected)/lists/_types';

interface ListFormModalProps {
  list?: List;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListFormModal({ list, isOpen, onClose }: ListFormModalProps) {
  const title = list ? 'リストを編集' : 'リストを作成';
  const submitLabel = list ? '更新' : '作成';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <ListForm list={list} submitLabel={submitLabel} cancel={onClose} />
    </BaseModal>
  );
}
