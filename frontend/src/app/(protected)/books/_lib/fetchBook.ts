import { bookDetailSchema, type BookDetail } from '@/app/(protected)/books/_types';

/**
 * 書籍詳細を取得する
 * サーバーコンポーネント（prefetch）とクライアントコンポーネント（useQuery）の両方で使用
 */
export async function fetchBook(id: number): Promise<BookDetail> {
  // サーバー側の場合は絶対URL、クライアント側の場合は相対URL
  const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_URL : '';
  const response = await fetch(`${baseUrl}/api/books/${id}`, {
    // サーバー側では常に最新データを取得
    cache: typeof window === 'undefined' ? 'no-store' : 'default',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '書籍詳細の取得に失敗しました');
  }

  const data = await response.json();
  return bookDetailSchema.parse(data);
}
