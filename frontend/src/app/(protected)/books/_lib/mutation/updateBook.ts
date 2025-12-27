import { BookBase, bookBaseSchema, BookUpdateData } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function updateBook(data: BookUpdateData): Promise<BookBase> {
  try {
    const response = await fetch(`/api/books/${data.id}`, {
      method: 'PUT',
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
