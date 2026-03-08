export default function BookDetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* パンくずリスト */}
      <nav className="flex flex-wrap items-center gap-2 min-w-0">
        <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
        <span className="text-slate-400">/</span>
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
      </nav>

      {/* メインカード */}
      <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
        <div className="w-32 h-44 shrink-0 animate-pulse rounded-lg bg-slate-200" />
        <div className="flex flex-col gap-4 min-w-0">
          {/* タイトル・著者 */}
          <div className="flex flex-col gap-1">
            <div className="h-9 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
          </div>

          {/* バッジ */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>

          {/* 評価 */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            ))}
          </div>

          {/* 説明 */}
          <div className="flex flex-col gap-1">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          </div>

          {/* メタデータ */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-slate-200">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-full sm:w-28 animate-pulse rounded-lg bg-slate-200" />
            ))}
            <div className="sm:ml-auto h-10 w-full sm:w-20 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="flex flex-col">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex gap-6">
            <div className="h-8 w-44 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          </nav>
        </div>
      </div>
    </div>
  );
}
