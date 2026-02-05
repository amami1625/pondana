import { Status, StatusFormData, statusSchema } from '@/app/(protected)/statuses/_types';

export async function createStatus(data: StatusFormData): Promise<Status> {
  const response = await fetch('/api/statuses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return statusSchema.parse(res);
}
