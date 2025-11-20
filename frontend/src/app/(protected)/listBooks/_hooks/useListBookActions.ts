import { useListBookMutations } from '@/app/(protected)/listBooks/_hooks/useListBookMutations';

export function useListBookActions() {
  const { addListBook, removeListBook } = useListBookMutations();

  const handleAdd = (listId: number, bookId: number) => {
    addListBook({
      list_id: listId,
      book_id: bookId,
    });
  };

  const handleRemove = (listBookId: number) => {
    removeListBook({ id: listBookId });
  };

  return {
    handleAdd,
    handleRemove,
  };
}
