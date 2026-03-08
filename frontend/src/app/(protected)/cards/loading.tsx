export default function CardsLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* ページタイトル */}
      <div className="h-8 w-28 animate-pulse rounded bg-slate-200 mb-6" />

      {/* フィルター */}
      <div className="flex gap-2 pb-6 border-b border-slate-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-slate-200" />
        ))}
      </div>

      {/* 本ごとのカードグループ */}
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-6 w-6 shrink-0 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-10 shrink-0 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </section>
      ))}
    </div>
  );
}
