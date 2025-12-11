import { useEffect, useState } from 'react';
import { GoogleBooksVolume } from '@/app/(protected)/books/_types';
import { searchBooks } from '@/lib/googleBooksApi';

export function useBookSearchApi() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GoogleBooksVolume[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const timer = setTimeout(async () => {
      const response = await searchBooks(trimmed, 20);
      setSuggestions(response.items || []);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
  };
}
