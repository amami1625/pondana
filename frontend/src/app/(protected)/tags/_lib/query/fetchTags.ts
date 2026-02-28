import { tagSchema, type Tag } from '@/app/(protected)/tags/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchTags = (): Promise<Tag[]> => fetchResource('/api/tags', tagSchema.array());
