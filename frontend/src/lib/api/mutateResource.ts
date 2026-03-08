import type { ZodType } from 'zod';

/**
 * APIへのミューテーション（POST/PUT/DELETE）を実行し、Zodスキーマでバリデーションして返す
 * スキーマを省略した場合はvoidを返す（DELETE用）
 */
export async function mutateResource<T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
  schema?: ZodType<T>,
): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  if (!schema) return undefined as T;

  const data = await response.json();
  return schema.parse(data);
}
