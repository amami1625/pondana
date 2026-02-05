import { Status, StatusFormData, statusSchema } from '@/app/(protected)/statuses/_types';

export type UpdateStatusData = StatusFormData & { id: number };

export async function updateStatus(data: UpdateStatusData): Promise<Status> {
  const { id, ...updateData } = data;
  const response = await fetch(`/api/statuses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return statusSchema.parse(res);
}
