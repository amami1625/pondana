export default function ListDetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* パンくずリスト */}
      <nav className="flex flex-wrap items-center gap-2 min-w-0">
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
        <span className="text-slate-400">/</span>
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      </nav>

      {/* メインカード */}
      <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
        <div className="flex flex-1 flex-col gap-6 min-w-0">
          {/* ヘッダー */}
          <div className="flex flex-wrap justify-between items-start gap-4 min-w-0">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="h-9 w-3/4 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>

          {/* 説明 */}
          <div className="flex flex-col gap-1">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>

          {/* メタデータ */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-slate-200">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200" />
            <div className="ml-auto h-10 w-20 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      {/* 追加済みの本 */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="w-16 h-22 shrink-0 animate-pulse rounded bg-slate-200" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
