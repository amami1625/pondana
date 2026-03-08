import { type ListBase, listBaseSchema } from '@/app/(protected)/lists/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export interface UpdateListData {
  id: string;
  name: string;
  description?: string;
  public: boolean;
}

export const updateList = (data: UpdateListData): Promise<ListBase> => {
  const { id, ...updateData } = data;
  return mutateResource(`/api/lists/${id}`, 'PUT', updateData, listBaseSchema);
};
