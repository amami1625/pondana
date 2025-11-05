import BaseModal from '@/components/BaseModal';
import BookItem from '@/app/(protected)/listBooks/_components/display/BookItem';
import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';

interface AddBookModalProps {
  listId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBookModal({ listId, isOpen, onClose }: AddBookModalProps) {
  const { data: books } = useBooks();

  return (
    <BaseModal title="本をリストに追加" isOpen={isOpen} onClose={onClose}>
      {!books || books.length === 0 ? (
        <p className="text-gray-500">本が登録されていません</p>
      ) : (
        <div className="space-y-2">
          {books.map((book) => (
            <BookItem key={book.id} book={book} listId={listId} />
          ))}
        </div>
      )}
    </BaseModal>
  );
}
