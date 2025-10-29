import { Category } from '@/app/(protected)/categories/_types';
import CategoryForm from '@/app/(protected)/categories/_components/forms';
import BaseModal from '@/components/BaseModal';
import { createCategory, updateCategory } from '@/app/(protected)/categories/_lib/actions';

interface CategoryModalProps {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  setCreatedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function CategoryModal({
  category,
  isOpen,
  onClose,
  setCreatedCategories,
}: CategoryModalProps) {
  const title = category ? 'カテゴリを編集' : 'カテゴリを追加';
  const action = category ? updateCategory : createCategory;
  const submitLabel = category ? '更新' : '追加';

  return (
    <BaseModal title={title} isOpen={isOpen} onClose={onClose}>
      <CategoryForm
        category={category}
        action={action}
        submitLabel={submitLabel}
        cancel={onClose}
        setCreatedCategories={setCreatedCategories}
      />
    </BaseModal>
  );
}
