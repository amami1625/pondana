import { listSchema, type List } from '@/schemas/list';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchUserLists = (id: string): Promise<List[]> =>
  fetchResource(`/api/users/${id}/lists`, listSchema.array());
