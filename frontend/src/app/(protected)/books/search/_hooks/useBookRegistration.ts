import type { GoogleBooksVolume, BookCreateData } from '../../_types';
import { getIsbn } from '@/lib/googleBooksApi';
import { useBookMutations } from '../../_hooks/useBookMutations';

export function useBookRegistration() {
  const { createBook, isCreating } = useBookMutations();

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

  return {
    registerBook,
    isRegistering: isCreating,
  };
}
