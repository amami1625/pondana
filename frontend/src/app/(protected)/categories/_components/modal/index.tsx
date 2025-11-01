import { Category } from '@/app/(protected)/categories/_types';
import CategoryForm from '@/app/(protected)/categories/_components/forms';
import BaseModal from '@/components/BaseModal';

interface CategoryModalProps {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
  const title = category ? 'カテゴリを編集' : 'カテゴリを追加';
  const submitLabel = category ? '更新' : '追加';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <CategoryForm category={category} submitLabel={submitLabel} cancel={onClose} />
    </BaseModal>
  );
}
