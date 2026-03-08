import { type Tag, type TagFormData, tagSchema } from '@/app/(protected)/tags/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const createTag = (data: TagFormData): Promise<Tag> =>
  mutateResource('/api/tags', 'POST', data, tagSchema);
