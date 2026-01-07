import PageTitle from '@/components/layout/PageTitle';
import {
  CategoryChart,
  MonthlyChart,
  OverviewStats,
  TagChart,
  RecentBooks,
} from '@/app/(protected)/dashboard/_components/detail';
import type { Dashboard } from '@/schemas/dashboard';

interface DashboardIndexViewProps {
  dashboard: Dashboard;
}

export default function DashboardIndexView({ dashboard }: DashboardIndexViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="ダッシュボード" />

      {/* 概要統計 */}
      <section className="mb-8">
        <OverviewStats data={dashboard.overview} />
      </section>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 月別読書数 */}
        <MonthlyChart data={dashboard.monthly} />

        {/* カテゴリー別 */}
        <CategoryChart data={dashboard.categories} />

        {/* タグ別 */}
        <TagChart data={dashboard.tags} />

        {/* 最近の書籍 */}
        <RecentBooks data={dashboard.recent_books} />
      </div>
    </div>
  );
}
