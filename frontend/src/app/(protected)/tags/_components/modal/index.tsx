import { Tag } from '@/schemas/tag';
import BaseModal from '@/components/modals/BaseModal';
import TagForm from '../forms';

interface TagModalProps {
  tag?: Tag;
  isOpen: boolean;
  onClose: () => void;
}

export default function TagModal({ tag, isOpen, onClose }: TagModalProps) {
  const title = tag ? 'タグを編集' : 'タグを追加';
  const submitLabel = tag ? '更新' : '追加';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <TagForm tag={tag} submitLabel={submitLabel} cancel={onClose} />
    </BaseModal>
  );
}
