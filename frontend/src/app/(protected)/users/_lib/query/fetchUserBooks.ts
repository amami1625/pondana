import { bookSchema, type Book } from '@/schemas/book';
import { USERS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * ユーザーの公開本一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchUserBooks(id: string): Promise<Book[]> {
  try {
    const response = await fetch(`/api/users/${id}/books`);

    if (!response.ok) {
      await handleApiError(response, USERS_ERROR_MESSAGES, 'Users');
    }

    const data = await response.json();
    return bookSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, USERS_ERROR_MESSAGES);
  }
}
