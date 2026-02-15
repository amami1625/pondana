import { topPageSchema, type TopPageData } from '@/schemas/top';

export async function fetchTopPageData(): Promise<TopPageData> {
  const response = await fetch('/api/top');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return topPageSchema.parse(data);
}
