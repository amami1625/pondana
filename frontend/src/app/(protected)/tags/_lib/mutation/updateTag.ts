import { type Tag, type TagFormData, tagSchema } from '@/app/(protected)/tags/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const updateTag = (data: TagFormData & { id: number }): Promise<Tag> => {
  const { id, ...updateData } = data;
  return mutateResource(`/api/tags/${id}`, 'PUT', updateData, tagSchema);
};
