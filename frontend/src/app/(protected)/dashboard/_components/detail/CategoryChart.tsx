'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryStats } from '@/schemas/dashboard';
import { COLORS } from '@/constants/categoryChartColors';

interface CategoryChartProps {
  data: CategoryStats;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  // データがない場合の処理
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">カテゴリー別</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          データがありません
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow p-6 border border-gray-200"
      data-testid="categoryChart"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">カテゴリー別</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="count"
            label={({ name, percent }) =>
              percent !== undefined ? `${name} (${(percent * 100).toFixed(0)}%)` : name
            }
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
