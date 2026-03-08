export default function BooksLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ページヘッダー */}
      <header className="mb-6">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-2">
            <div className="h-8 w-16 animate-pulse rounded bg-slate-200 mb-6" />
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="flex items-end">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </header>

      {/* カテゴリフィルター */}
      <div className="flex gap-2 pb-6 border-b border-slate-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-slate-200" />
        ))}
      </div>

      {/* 本のリスト */}
      <div className="flex flex-col gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-32 h-44 shrink-0 animate-pulse rounded-lg bg-slate-200" />
              <div className="flex flex-col gap-3 flex-1">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
