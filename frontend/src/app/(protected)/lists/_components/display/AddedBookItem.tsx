'use client';

import { AddedBook } from '@/app/(protected)/lists/_types';
import { useListBookActions } from '@/app/(protected)/listBooks/_hooks/useListBookActions';
import Button from '@/components/buttons/Button';

interface AddedBookProps {
  book: AddedBook;
  listBookId: number;
}

export default function AddedBookItem({ book, listBookId }: AddedBookProps) {
  const { handleRemove } = useListBookActions();

  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{book.title}</h3>

          {/* 著者 */}
          {book.authors.length > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-gray-500">著者:</span>
              <p className="text-sm text-gray-700">
                {book.authors.map((author) => author.name).join(', ')}
              </p>
            </div>
          )}

          {/* カテゴリ */}
          {book.category && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">カテゴリ:</span>
              <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {book.category.name}
              </span>
            </div>
          )}

          {/* リストから削除 */}
          <Button variant="remove" onClick={() => handleRemove(listBookId)}>
            削除
          </Button>
        </div>
      </div>
    </div>
  );
}
