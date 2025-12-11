import { Status } from '@/schemas/status';
import BaseModal from '@/components/modals/BaseModal';
import StatusForm from '@/app/(protected)/statuses/_components/forms';

interface StatusModalProps {
  status?: Status;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusModal({ status, isOpen, onClose }: StatusModalProps) {
  const title = status ? 'ステータスを編集' : 'ステータスを追加';
  const submitLabel = status ? '更新' : '追加';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <StatusForm status={status} submitLabel={submitLabel} cancel={onClose} />
    </BaseModal>
  );
}
