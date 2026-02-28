import { listSchema, type List } from '@/app/(protected)/lists/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchLists = (): Promise<List[]> => fetchResource('/api/lists', listSchema.array());
