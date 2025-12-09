import { useEffect, useState } from 'react';
import { GoogleBooksVolume } from '@/app/(protected)/books/_types';

export function useBookSuggestions(
  suggestions: GoogleBooksVolume[],
  onSelectBook: (book: GoogleBooksVolume) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const hasSuggestions = suggestions.length > 0;

  // 検索結果(suggestions)の変化に応じて開閉＆選択インデックス調整
  useEffect(() => {
    if (!hasSuggestions) {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    // 検索結果が来たら開いて0番目を選択
    setIsOpen(true);
    setSelectedIndex(0);
  }, [hasSuggestions, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestions) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setSelectedIndex((prev) => {
          if (prev < 0) return 0;
          if (prev < suggestions.length - 1) return prev + 1;
          return prev;
        });
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSelectBook(suggestions[selectedIndex]);
          setIsOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleClickItem = (index: number) => {
    const book = suggestions[index];
    if (!book) return;
    onSelectBook(book);
    setSelectedIndex(index);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    selectedIndex,
    handleKeyDown,
    handleClickItem,
  };
}
