import { useState } from 'react';
import { deleteCategory } from '../_lib/actions';

export const useDeleteCategory = () => {
  const [error, setError] = useState<string>('');

  const onDelete = async (id: number): Promise<boolean> => {
    if (!confirm('本当に削除しますか？')) {
      return false;
    }

    const res = await deleteCategory(id);
    if ('error' in res) {
      setError(res.error);
      return false;
    }

    return true;
  };

  return { error, onDelete };
};
