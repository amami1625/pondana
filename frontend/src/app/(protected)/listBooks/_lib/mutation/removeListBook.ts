import { mutateResource } from '@/lib/api/mutateResource';

export const removeListBook = ({ id }: { id: number }): Promise<void> =>
  mutateResource(`/api/list_books/${id}`, 'DELETE');
