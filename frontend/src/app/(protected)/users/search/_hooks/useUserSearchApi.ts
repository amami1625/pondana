import { useEffect, useState } from 'react';
import { UserSearchResult } from '@/schemas/user';

export function useUserSearchApi() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
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
      try {
        const response = await fetch(`/api/users?q=${encodeURIComponent(trimmed)}`);
        if (!response.ok) {
          throw new Error('ユーザー検索に失敗しました');
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('User search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
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
