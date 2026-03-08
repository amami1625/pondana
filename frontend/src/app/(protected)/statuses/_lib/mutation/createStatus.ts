import { type Status, type StatusFormData, statusSchema } from '@/app/(protected)/statuses/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const createStatus = (data: StatusFormData): Promise<Status> =>
  mutateResource('/api/statuses', 'POST', data, statusSchema);
