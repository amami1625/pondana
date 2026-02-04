import { bookDetailSchema, type BookDetail } from '@/app/(protected)/books/_types';

/**
 * 書籍詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchBook(id: string): Promise<BookDetail> {
  const response = await fetch(`/api/books/${id}`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return bookDetailSchema.parse(data);
}
