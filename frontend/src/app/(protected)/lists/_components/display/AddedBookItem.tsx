'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Star } from 'lucide-react';
import { AddedBook } from '@/app/(protected)/lists/_types';
import Button from '@/components/buttons/Button';
import { useListBookMutations } from '@/app/(protected)/listBooks/_hooks/useListBookMutations';

interface AddedBookProps {
  book: AddedBook;
  listBookId: number;
  isOwner?: boolean;
}

export default function AddedBookItem({ book, listBookId, isOwner = false }: AddedBookProps) {
  const { removeListBook } = useListBookMutations();

  return (
    <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-lg">
      {/* 書籍カバー画像 */}
      {book.thumbnail ? (
        <Image
          src={book.thumbnail}
          alt={book.title}
          width={128}
          height={176}
          className="w-32 h-44 shrink-0 object-cover"
        />
      ) : (
        <div className="w-32 h-44 shrink-0 flex items-center justify-center bg-slate-200">
          <div className="text-slate-600 text-center p-4">
            <div className="text-5xl font-black mb-2">{book.title.charAt(0).toUpperCase()}</div>
            {book.category && (
              <div className="text-xs font-medium bg-slate-300/50 rounded px-2 py-1">
                {book.category.name}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {/* タイトルと削除ボタン */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{book.title}</h3>
            {book.authors && book.authors.length > 0 && (
              <p className="text-sm text-slate-600 mb-2">
                {book.authors.map((author) => author).join(', ')}
              </p>
            )}
          </div>
          {/* 所有者の場合のみ削除ボタンを表示 */}
          {isOwner && (
            <Button
              variant="danger"
              onClick={() => removeListBook({ id: listBookId })}
              icon={<Trash2 size={18} />}
            >
              リストから削除
            </Button>
          )}
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

        {/* 詳細ページへのリンク（所有者のみ） */}
        {isOwner && (
          <div className="mt-4 flex justify-between items-center">
            <Link
              href={`/books/${book.id}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              詳細を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
