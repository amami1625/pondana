'use client';

import { AddedList } from '@/app/(protected)/books/_types';
import { useListBookMutations } from '@/app/(protected)/listBooks/_hooks/useListBookMutations';
import { RemoveButton } from '@/components/Buttons';
import ErrorMessage from '@/components/ErrorMessage';

interface AddedListItemProps {
  list: AddedList;
  listBookId: number;
}

export default function AddedListItem({ list, listBookId }: AddedListItemProps) {
  const { removeListBook, removeError } = useListBookMutations();

  const handleRemove = () => {
    removeListBook({ id: listBookId });
  };

  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      {removeError && <ErrorMessage message={removeError.message} />}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* リスト名 */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{list.name}</h3>

          {/* 公開/非公開 */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">公開:</span>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                list.public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {list.public ? '公開' : '非公開'}
            </span>
          </div>
        </div>

        {/* リストから削除 */}
        <div className="flex-shrink-0">
          <RemoveButton onClick={handleRemove} />
        </div>
      </div>
    </div>
  );
}
