export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ページタイトル */}
      <div className="mb-8">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
      </div>

      {/* 概要統計 */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </section>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
