export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ページタイトル */}
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200 mb-6" />

      {/* 概要統計 */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-8 w-12 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 mb-4" />
            <div className="h-[300px] animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
