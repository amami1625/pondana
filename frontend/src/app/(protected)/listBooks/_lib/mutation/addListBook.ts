import { ListBook, ListBookFormData, listBookSchema } from '@/app/(protected)/listBooks/_types';
import { LIST_BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

export async function addListBook(data: ListBookFormData): Promise<ListBook> {
  try {
    const response = await fetch('/api/list_books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response, LIST_BOOKS_ERROR_MESSAGES, 'ListBooks');
    }

    const res = await response.json();
    return listBookSchema.parse(res);
  } catch (error) {
    handleNetworkError(error, LIST_BOOKS_ERROR_MESSAGES);
  }
}
