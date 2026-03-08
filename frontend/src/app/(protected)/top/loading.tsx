export default function TopLoading() {
  return (
    <>
      {/* ページ見出し */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
      </div>

      {/* 最近作成した本 */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-44 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-[2/3] animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </section>

      {/* 最近作成したリスト */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-52 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </section>

      {/* 最近作成したカード */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-52 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </section>
    </>
  );
}
