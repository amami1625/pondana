import Link from 'next/link';
import { Book } from '@/app/(protected)/books/_types';
import { getCategoryColor } from '@/lib/utils';
import { getCategoryBadgeColor } from '@/app/(protected)/books/_lib/getCategoryBadgeColor';

export default function BookListCard({ book }: { book: Book }) {
  const coverColorClass = getCategoryColor(book.category?.name);
  const badgeColors = getCategoryBadgeColor(book.category?.name);

  return (
    <Link
      href={`/books/${book.id}`}
      className="block p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div className="flex items-stretch justify-between gap-6">
        {/* 書籍カバー画像 */}
        <div
          className={`w-32 h-44 shrink-0 rounded-lg flex items-center justify-center ${coverColorClass}`}
        >
          <div className="text-white text-center p-4">
            <div className="text-5xl font-black mb-2">{book.title.charAt(0).toUpperCase()}</div>
            {book.category && (
              <div className="text-xs font-medium bg-white/20 rounded px-2 py-1 backdrop-blur-sm">
                {book.category.name}
              </div>
            )}
          </div>
        </div>

        {/* 書籍情報 */}
        <div className="flex flex-1 flex-col justify-between gap-2 py-1">
          <div className="flex flex-col gap-1">
            {/* タイトル */}
            <p className="text-slate-900 text-lg font-bold leading-tight">{book.title}</p>

            {/* 著者 | 最終更新日 */}
            <p className="text-slate-500 text-sm font-normal leading-normal">
              {book.authors && book.authors.length > 0
                ? `${book.authors.map((a) => a.name).join(', ')} | `
                : ''}
              最終更新: {book.updated_at}
            </p>

            {/* 説明文 */}
            {book.description && (
              <p className="text-slate-600 text-sm font-normal leading-normal mt-2 line-clamp-2">
                {book.description}
              </p>
            )}
          </div>

          {/* カテゴリバッジ */}
          {book.category && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${badgeColors.bg} ${badgeColors.text}`}
              >
                {book.category.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
