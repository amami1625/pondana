import { AddButton } from '@/components/Buttons';
import ErrorMessage from '@/components/ErrorMessage';
import { List } from '@/app/(protected)/lists/_types';
import { useAddListBook } from '@/app/(protected)/listBooks/_hooks/useAddListBook';

interface ListItemProps {
  list: List;
  bookId: number;
}

export default function Listitem({ list, bookId }: ListItemProps) {
  const { error, handleAdd } = useAddListBook();
  const isAdded = list.book_ids.includes(bookId);

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      {error && <ErrorMessage message={error} />}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{list.name}</h3>
        </div>

        {/* 追加ボタン */}
        <div className="flex-shrink-0">
          <AddButton onClick={() => handleAdd(list.id, bookId)} isAdded={isAdded} />
        </div>
      </div>
    </div>
  );
}
