import { bookSchema, type Book } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * 書籍一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch('/api/books');

    if (!response.ok) {
      await handleApiError(response, BOOKS_ERROR_MESSAGES, 'Books');
    }

    const data = await response.json();
    return bookSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, BOOKS_ERROR_MESSAGES);
  }
}
