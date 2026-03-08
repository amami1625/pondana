export default function ListsLoading() {
  return (
    <>
      {/* ページタイトル */}
      <div className="h-8 w-28 animate-pulse rounded bg-slate-200 mb-6" />

      {/* 新規作成ボタン */}
      <div className="mb-6 flex justify-end">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-200" />
      </div>

      {/* リストカード */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* ブックマークアイコン */}
              <div className="shrink-0 w-12 h-12 animate-pulse rounded-lg bg-slate-200" />

              {/* リスト情報 */}
              <div className="flex flex-col gap-2 min-w-0 flex-1">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                </div>
              </div>

              {/* 詳細ボタン */}
              <div className="sm:self-end sm:ml-auto">
                <div className="h-10 w-full sm:w-16 animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
