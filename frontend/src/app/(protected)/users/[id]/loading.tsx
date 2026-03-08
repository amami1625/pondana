export default function UserDetailLoading() {
  return (
    <div className="space-y-8">
      {/* ユーザープロフィールカード */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex flex-col items-center">
            {/* アバター */}
            <div className="w-32 h-32 rounded-full animate-pulse bg-slate-200 mb-4" />

            {/* ユーザー名 */}
            <div className="h-7 w-32 animate-pulse rounded bg-slate-200 mb-4" />

            {/* フォローボタン */}
            <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200 mb-6" />

            {/* 統計情報 */}
            <div className="flex gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 animate-pulse rounded bg-slate-200" />
                    <div className="h-7 w-8 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 本一覧 */}
      <div className="space-y-6">
        <div className="h-7 w-20 animate-pulse rounded bg-slate-200" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-32 h-44 shrink-0 animate-pulse rounded-lg bg-slate-200" />
                <div className="flex flex-col gap-3 flex-1">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 公開リスト */}
      <div className="space-y-6">
        <div className="h-7 w-28 animate-pulse rounded bg-slate-200" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="shrink-0 w-12 h-12 animate-pulse rounded-lg bg-slate-200" />
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
                <div className="sm:self-end sm:ml-auto">
                  <div className="h-10 w-full sm:w-16 animate-pulse rounded-lg bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
