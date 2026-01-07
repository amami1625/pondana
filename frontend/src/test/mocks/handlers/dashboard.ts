import { createMockDashboard } from '@/test/factories/dashboard';
import { http, HttpResponse } from 'msw';

export const dashboardHandlers = [
  http.get('/api/dashboard', () => {
    return HttpResponse.json(createMockDashboard());
  }),
];
