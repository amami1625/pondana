import { useState } from 'react';
import { Category } from '@/app/(protected)/categories/_types';
import { useCategoryMutations } from '@/app/(protected)/categories/_hooks/useCategoryMutations';
import { useModal } from '@/hooks/useModal';

export function useSettingCategory() {
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const { deleteCategory } = useCategoryMutations();
  const createModal = useModal();
  const editModal = useModal();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingCategory(undefined);
    createModal.open();
  };

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteCategory(id);
  };

  return {
    editingCategory,
    handleEdit,
    handleCreate,
    handleDelete,
    createModal,
    editModal,
  };
}
