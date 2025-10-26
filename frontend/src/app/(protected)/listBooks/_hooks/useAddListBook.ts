import { useState } from 'react';
import { addListBook } from '../_lib/actions';

export const useAddListBook = () => {
  const [error, setError] = useState('');

  const handleAdd = async (list_id: number, book_id: number) => {
    const res = await addListBook({ list_id, book_id });

    if ('error' in res) {
      setError(res.error);
      return;
    }
  };

  return {
    error,
    handleAdd,
  };
};
