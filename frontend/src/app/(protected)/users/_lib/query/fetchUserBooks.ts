import { bookSchema, type Book } from '@/schemas/book';

/**
 * ユーザーの公開本一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchUserBooks(id: string): Promise<Book[]> {
  const response = await fetch(`/api/users/${id}/books`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'ユーザーの公開本一覧の取得に失敗しました');
  }

  const data = await response.json();
  return bookSchema.array().parse(data);
}
