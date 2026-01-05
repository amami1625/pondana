import { dashboardSchema, type Dashboard } from '@/schemas/dashboard';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';
import { DASHBOARD_ERROR_MESSAGES } from '@/constants/errorMessages';

/**
 * ダッシュボードデータを取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchDashboard(): Promise<Dashboard> {
  try {
    const response = await fetch('/api/dashboard');

    if (!response.ok) {
      await handleApiError(response, DASHBOARD_ERROR_MESSAGES, 'Dashboard');
    }

    const data = await response.json();
    return dashboardSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, DASHBOARD_ERROR_MESSAGES);
  }
}
