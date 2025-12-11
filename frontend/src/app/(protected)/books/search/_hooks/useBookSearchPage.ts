import { useState } from 'react';
import type { GoogleBooksVolume } from '@/app/(protected)/books/_types';

export function useBookSearchPage() {
  const [selectedBook, setSelectedBook] = useState<GoogleBooksVolume | null>(null);

  const handleSelectBook = (book: GoogleBooksVolume) => {
    setSelectedBook(book);
  };

  const handleClearSelection = () => {
    setSelectedBook(null);
  };

  return {
    selectedBook,
    handleSelectBook,
    handleClearSelection,
  };
}
