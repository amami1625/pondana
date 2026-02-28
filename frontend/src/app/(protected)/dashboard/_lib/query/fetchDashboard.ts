import { dashboardSchema, type Dashboard } from '@/schemas/dashboard';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchDashboard = (): Promise<Dashboard> =>
  fetchResource('/api/dashboard', dashboardSchema);
