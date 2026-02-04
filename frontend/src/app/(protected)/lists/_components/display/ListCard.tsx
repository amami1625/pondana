import Link from 'next/link';
import { List } from '@/app/(protected)/lists/_types';
import { Clock, Bookmark } from 'lucide-react';

interface ListCardProps {
  list: List;
}

export default function ListCard({ list }: ListCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* ブックマークアイコンエリア */}
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20">
          <Bookmark className="h-6 w-6 text-primary" />
        </div>

        {/* リスト情報 */}
        <div className="flex flex-col gap-2 min-w-0">
          {/* タイトル */}
          <h2 className="text-lg font-semibold text-slate-800 line-clamp-2">{list.name}</h2>

          {/* 説明 */}
          {list.description && (
            <p className="text-sm text-slate-600 line-clamp-2">{list.description}</p>
          )}

          {/* メタ情報 */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>登録数: {list.books_count}冊</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>更新: {list.updated_at}</span>
            </div>
          </div>
        </div>

        {/* 詳細ページへのリンク */}
        <div className="sm:self-end sm:ml-auto">
          <Link
            href={`/lists/${list.id}`}
            className="flex w-full sm:w-auto items-center justify-center rounded-lg h-10 px-4 text-sm font-bold transition-colors bg-primary text-white hover:bg-primary/90"
          >
            詳細
          </Link>
        </div>
      </div>
    </div>
  );
}
