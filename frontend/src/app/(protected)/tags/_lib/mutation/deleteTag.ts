import { mutateResource } from '@/lib/api/mutateResource';

export const deleteTag = ({ id }: { id: number }): Promise<void> =>
  mutateResource(`/api/tags/${id}`, 'DELETE');
