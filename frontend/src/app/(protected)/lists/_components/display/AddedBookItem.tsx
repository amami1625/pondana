'use client';

import Link from 'next/link';
import { Trash2, Star } from 'lucide-react';
import { AddedBook } from '@/app/(protected)/lists/_types';
import { getCategoryColor } from '@/lib/utils';
import { useListBookActions } from '@/app/(protected)/listBooks/_hooks/useListBookActions';

interface AddedBookProps {
  book: AddedBook;
  listBookId: number;
}

export default function AddedBookItem({ book, listBookId }: AddedBookProps) {
  const { handleRemove } = useListBookActions();
  const coverColorClass = getCategoryColor(book.category?.name);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-lg">
      {/* 書籍カバー画像 */}
      <div className={`h-48 w-full flex items-center justify-center ${coverColorClass}`}>
        <div className="text-white text-center p-4">
          <div className="text-5xl font-black mb-2">{book.title.charAt(0).toUpperCase()}</div>
          {book.category && (
            <div className="text-xs font-medium bg-white/20 rounded px-2 py-1 backdrop-blur-sm">
              {book.category.name}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* タイトルと削除ボタン */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{book.title}</h3>
            {book.authors && book.authors.length > 0 && (
              <p className="text-sm text-slate-600 mb-2">
                {book.authors.map((author) => author.name).join(', ')}
              </p>
            )}
          </div>
          <button
            onClick={() => handleRemove(listBookId)}
            className="ml-2 flex-shrink-0 rounded-full p-2 text-slate-500 cursor-pointer hover:bg-slate-100 hover:text-red-500"
            title="リストから削除"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* 評価（星） */}
        {book.rating && book.rating > 0 && (
          <div className="flex items-center gap-1 text-primary mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < (book.rating ?? 0) ? 'fill-current' : ''}`} />
            ))}
          </div>
        )}

        {/* 説明 */}
        {book.description && <p className="text-sm text-slate-700 flex-1">{book.description}</p>}

        {/* 詳細ページへのリンク */}
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`/books/${book.id}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
