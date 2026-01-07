'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TagStats } from '@/schemas/dashboard';

interface TagChartProps {
  data: TagStats;
}

export default function TagChart({ data }: TagChartProps) {
  // 降順にソート（上位10件のみ表示）
  const chartData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

  // データがない場合の処理
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">タグ別（上位10件）</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          データがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200" data-testid="tagChart">
      <h3 className="text-lg font-bold text-gray-900 mb-4">タグ別（上位10件）</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
