import { bookSchema, type Book } from '@/app/(protected)/books/_types';

/**
 * 書籍一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch('/api/books');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return bookSchema.array().parse(data);
}
