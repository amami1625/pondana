import { useState } from 'react';
import { Tag } from '@/app/(protected)/tags/_types';
import { useModal } from '@/hooks/useModal';
import { useTagMutations } from '@/app/(protected)/tags/_hooks/useTagMutations';

export function useSettingTag() {
  const [editingTag, setEditingTag] = useState<Tag | undefined>();
  const { deleteTag } = useTagMutations();
  const createModal = useModal();
  const editModal = useModal();

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingTag(undefined);
    createModal.open();
  };

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteTag(id);
  };

  return {
    editingTag,
    handleEdit,
    handleCreate,
    handleDelete,
    createModal,
    editModal,
  };
}
