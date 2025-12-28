import { bookDetailSchema, type BookDetail } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * 書籍詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchBook(id: string): Promise<BookDetail> {
  try {
    const response = await fetch(`/api/books/${id}`);

    if (!response.ok) {
      await handleApiError(response, BOOKS_ERROR_MESSAGES, 'Books');
    }

    const data = await response.json();
    return bookDetailSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, BOOKS_ERROR_MESSAGES);
  }
}
