import { useState } from 'react';
import type { GoogleBooksVolume } from '../../_types';

export function useBookSelection() {
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
