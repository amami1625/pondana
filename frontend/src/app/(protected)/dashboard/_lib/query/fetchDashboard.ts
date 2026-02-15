import { dashboardSchema, type Dashboard } from '@/schemas/dashboard';

export async function fetchDashboard(): Promise<Dashboard> {
  const response = await fetch('/api/dashboard');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return dashboardSchema.parse(data);
}
