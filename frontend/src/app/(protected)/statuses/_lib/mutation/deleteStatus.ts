import { mutateResource } from '@/lib/api/mutateResource';

export const deleteStatus = (id: number): Promise<void> =>
  mutateResource(`/api/statuses/${id}`, 'DELETE');
