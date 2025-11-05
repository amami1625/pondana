import { AddButton } from '@/components/Buttons';
import ErrorMessage from '@/components/ErrorMessage';
import { List } from '@/app/(protected)/lists/_types';
import { useListBookMutations } from '@/app/(protected)/listBooks/_hooks/useListBookMutations';

interface ListItemProps {
  list: List;
  bookId: number;
  isAdded: boolean;
}

export default function Listitem({ list, bookId, isAdded }: ListItemProps) {
  const { addListBook, addError } = useListBookMutations();

  const handleAdd = () => {
    addListBook({
      list_id: list.id,
      book_id: bookId,
    });
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      {addError && <ErrorMessage message={addError.message} />}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{list.name}</h3>
        </div>

        {/* 追加ボタン */}
        <div className="flex-shrink-0">
          <AddButton onClick={handleAdd} isAdded={isAdded} />
        </div>
      </div>
    </div>
  );
}
