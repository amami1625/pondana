import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/app/(protected)/books/_types';
import { CategoryBadge, TagBadge } from '@/components/badges';

interface BookListCardProps {
  book: Book;
  showDetailLink?: boolean;
}

export default function BookListCard({ book, showDetailLink = true }: BookListCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* 書籍カバー画像 */}
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={128}
            height={176}
            className="w-32 h-44 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="w-32 h-44 shrink-0 rounded-lg flex items-center justify-center bg-slate-200">
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

        {/* 書籍情報 */}
        <div className="flex flex-col gap-3 min-w-0">
          {/* タイトル */}
          <p className="text-slate-900 text-lg font-bold leading-tight line-clamp-2">
            {book.title}
          </p>

          {/* 著者・最終更新日 */}
          <div className="text-slate-500 text-sm">
            {book.authors && book.authors.length > 0 && (
              <p className="line-clamp-1">著者: {book.authors.join(', ')}</p>
            )}
            <p>最終更新: {book.updated_at}</p>
          </div>

          {/* 説明文 */}
          {book.description && (
            <p className="text-slate-600 text-sm line-clamp-2">{book.description}</p>
          )}

          {/* カテゴリ・タグ */}
          {book.category && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 text-xs">
              <span>カテゴリ:</span>
              <CategoryBadge label={book.category.name} />
              <span>タグ:</span>
              {book.tags.map((tag) => (
                <TagBadge key={tag.id} label={tag.name} />
              ))}
            </div>
          )}
        </div>

        {/* 詳細ページへのリンク */}
        {showDetailLink && (
          <div className="sm:self-end sm:ml-auto">
            <Link
              href={`/books/${book.id}`}
              className="flex w-full sm:w-auto items-center justify-center rounded-lg h-10 px-4 text-sm font-bold transition-colors bg-primary text-white hover:bg-primary/90"
            >
              詳細
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
