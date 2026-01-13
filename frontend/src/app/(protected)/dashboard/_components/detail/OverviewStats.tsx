import type { OverviewStats as OverviewStatsType } from '@/schemas/dashboard';
import { useOverviewStats } from '@/app/(protected)/dashboard/_hooks/useOverviewStats';

interface OverviewStatsProps {
  data: OverviewStatsType;
}

export default function OverviewStats({ data }: OverviewStatsProps) {
  const { stats } = useOverviewStats(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`text-4xl ${stat.color} p-3 rounded-full`}>
              <stat.icon />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
