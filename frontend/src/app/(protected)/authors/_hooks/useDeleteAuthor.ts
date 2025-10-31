import { useState } from 'react';
import { deleteAuthor } from '@/app/(protected)/authors/_lib/actions';

export const useDeleteAuthor = () => {
  const [error, setError] = useState<string>('');

  const onDelete = async (id: number): Promise<boolean> => {
    if (!confirm('本当に削除しますか？')) {
      return false;
    }

    const res = await deleteAuthor(id);
    if ('error' in res) {
      setError(res.error);
      return false;
    }

    return true;
  };

  return { error, onDelete };
};
