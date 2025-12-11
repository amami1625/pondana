import type { GoogleBooksVolume, BookCreateData } from '@/app/(protected)/books/_types';
import { getIsbn } from '@/lib/googleBooksApi';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';
import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';

export function useBookSelected() {
  const { createBook, isCreating } = useBookMutations();
  const { data: books } = useBooks();

  const registerBook = (book: GoogleBooksVolume) => {
    const bookData: BookCreateData = {
      google_books_id: book.id,
      isbn: getIsbn(book) || undefined,
      title: book.volumeInfo.title,
      subtitle: book.volumeInfo.subtitle || undefined,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || undefined,
      authors: book.volumeInfo.authors || [],
      description: undefined,
      category_id: undefined,
      tag_ids: [],
      rating: undefined,
      reading_status: 'unread' as const,
      public: false,
    };

    createBook(bookData);
  };

  const isAlreadyRegistered = (googleBooksId: string) => {
    if (!books) return false;
    return books.some((book) => book.google_books_id === googleBooksId);
  };

  return {
    registerBook,
    isRegistering: isCreating,
    isAlreadyRegistered,
  };
}
