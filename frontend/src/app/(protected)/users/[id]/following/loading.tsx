export default function FollowingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 戻るリンク */}
        <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />

        {/* ページタイトル */}
        <div className="h-9 w-32 animate-pulse rounded bg-slate-200" />

        {/* ユーザー一覧 */}
        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 shrink-0 rounded-full animate-pulse bg-slate-200" />
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
