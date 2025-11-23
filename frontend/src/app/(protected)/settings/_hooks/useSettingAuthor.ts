import { useState } from 'react';
import { Author } from '@/app/(protected)/authors/_types';
import { useAuthorMutations } from '@/app/(protected)/authors/_hooks/useAuthorMutations';
import { useModal } from '@/hooks/useModal';

export function useSettingAuthor() {
  const [editingAuthor, setEditingAuthor] = useState<Author | undefined>();
  const createModal = useModal();
  const editModal = useModal();
  const { deleteAuthor } = useAuthorMutations();

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingAuthor(undefined);
    createModal.open();
  };

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }
    deleteAuthor(id);
  };

  return {
    editingAuthor,
    handleEdit,
    handleCreate,
    handleDelete,
    createModal,
    editModal,
  };
}
