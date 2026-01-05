import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchDashboard } from '@/app/(protected)/dashboard/_lib/query/fetchDashboard';

/**
 * ダッシュボードデータを取得するカスタムフック
 */
export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: fetchDashboard,
  });
}
