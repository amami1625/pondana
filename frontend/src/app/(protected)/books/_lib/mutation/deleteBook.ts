import { mutateResource } from '@/lib/api/mutateResource';

export const deleteBook = ({ id }: { id: string }): Promise<void> =>
  mutateResource(`/api/books/${id}`, 'DELETE');
