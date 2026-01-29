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
    <div className="relative p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-stretch justify-between gap-6">
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
        <div className="flex flex-1 flex-col justify-between gap-2 py-1">
          <div className="flex flex-col gap-1">
            {/* タイトル */}
            <p className="text-slate-900 text-lg font-bold leading-tight">{book.title}</p>

            {/* 著者 | 最終更新日 */}
            <div className="text-slate-500 text-sm font-normal leading-normal">
              <p>
                {book.authors && book.authors.length > 0
                  ? `著者: ${book.authors.map((author) => author).join(', ')}`
                  : ''}
              </p>
              <p>最終更新: {book.updated_at}</p>
            </div>

            {/* 説明文 */}
            {book.description && (
              <p className="text-slate-600 text-sm font-normal leading-normal mt-2 line-clamp-2">
                {book.description}
              </p>
            )}
          </div>

          {/* カテゴリ・タグ */}
          {book.category && (
            <div className="flex items-center gap-2 text-xs">
              カテゴリ: <CategoryBadge label={book.category.name} />
              タグ:
              {book.tags.map((tag) => (
                <TagBadge key={tag.id} label={tag.name} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 詳細ページへのリンク */}
      {showDetailLink && (
        <div className="flex justify-end mt-2">
          <Link
            href={`/books/${book.id}`}
            className="inline-flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold transition-colors cursor-pointer gap-2 bg-primary text-white hover:bg-primary/90"
          >
            詳細
          </Link>
        </div>
      )}
    </div>
  );
}
