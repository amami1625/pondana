import type { ZodType } from 'zod';

/**
 * APIからリソースを取得し、Zodスキーマでバリデーションして返す
 */
export async function fetchResource<T>(endpoint: string, schema: ZodType<T>): Promise<T> {
  const response = await fetch(endpoint);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return schema.parse(data);
}
