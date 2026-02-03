import Link from 'next/link';
import { List } from '@/app/(protected)/lists/_types';
import { Clock, Bookmark } from 'lucide-react';

interface ListCardProps {
  list: List;
}

export default function ListCard({ list }: ListCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        {/* ブックマークアイコンエリア */}
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20">
          <Bookmark className="h-6 w-6 text-primary" />
        </div>

        {/* リスト情報 */}
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h2 className="text-lg font-semibold text-slate-800 truncate mb-1">{list.name}</h2>

          {/* 説明 */}
          {list.description && (
            <p className="mb-2 text-sm text-slate-600 line-clamp-2">{list.description}</p>
          )}

          {/* メタ情報 */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            {/* 登録数 */}
            <div className="flex items-center gap-1">
              <span>登録数: {list.books_count}冊</span>
            </div>
            {/* 更新日 */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>更新: {list.updated_at}</span>
            </div>
          </div>
        </div>
        {/* 詳細ページへのリンク */}
        <div className="flex justify-end mt-2">
          <Link
            href={`/lists/${list.id}`}
            className="inline-flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold transition-colors cursor-pointer gap-2 bg-primary text-white hover:bg-primary/90"
          >
            詳細
          </Link>
        </div>
      </div>
    </div>
  );
}
