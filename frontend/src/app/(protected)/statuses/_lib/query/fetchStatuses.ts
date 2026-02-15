import { statusSchema, type Status } from '@/app/(protected)/statuses/_types';

export async function fetchStatuses(): Promise<Status[]> {
  const response = await fetch('/api/statuses');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return statusSchema.array().parse(data);
}
