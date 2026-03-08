import { type Status, type StatusFormData, statusSchema } from '@/app/(protected)/statuses/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export type UpdateStatusData = StatusFormData & { id: number };

export const updateStatus = (data: UpdateStatusData): Promise<Status> => {
  const { id, ...updateData } = data;
  return mutateResource(`/api/statuses/${id}`, 'PUT', updateData, statusSchema);
};
