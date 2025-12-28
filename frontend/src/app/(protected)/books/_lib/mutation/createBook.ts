import { BookBase, bookBaseSchema, BookCreateData } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function createBook(data: BookCreateData): Promise<BookBase> {
  try {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, BOOKS_ERROR_MESSAGES, 'Books');
    }

    const res = await response.json();
    return bookBaseSchema.parse(res);
  } catch (error) {
    handleNetworkError(error, BOOKS_ERROR_MESSAGES);
  }
}
