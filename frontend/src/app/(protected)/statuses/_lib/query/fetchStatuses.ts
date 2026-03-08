import { statusSchema, type Status } from '@/app/(protected)/statuses/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchStatuses = (): Promise<Status[]> =>
  fetchResource('/api/statuses', statusSchema.array());
