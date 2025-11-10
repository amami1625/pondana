import toast from 'react-hot-toast';
import { useListBookMutations } from '@/app/(protected)/listBooks/_hooks/useListBookMutations';

export function useListBookActions() {
  const { addListBook, removeListBook } = useListBookMutations();

  const handleAdd = (listId: number, bookId: number) => {
    addListBook(
      {
        list_id: listId,
        book_id: bookId,
      },
      {
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleRemove = (listBookId: number) => {
    removeListBook(
      { id: listBookId },
      {
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return {
    handleAdd,
    handleRemove,
  };
}
