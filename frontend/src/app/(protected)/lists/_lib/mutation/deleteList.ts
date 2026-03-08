import { mutateResource } from '@/lib/api/mutateResource';

export const deleteList = (id: string): Promise<void> =>
  mutateResource(`/api/lists/${id}`, 'DELETE');
