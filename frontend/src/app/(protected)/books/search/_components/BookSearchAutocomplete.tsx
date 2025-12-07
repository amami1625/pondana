'use client';

import { useState, useRef, useEffect } from 'react';
import type { GoogleBooksVolume } from '@/app/(protected)/books/_types';
import { searchBooks } from '@/lib/googleBooksApi';

interface BookSearchAutocompleteProps {
  onSelectBook: (book: GoogleBooksVolume) => void;
}

export function BookSearchAutocomplete({ onSelectBook }: BookSearchAutocompleteProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<GoogleBooksVolume[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 検索API呼び出し（デバウンス付き）
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(async () => {
      const response = await searchBooks(value, 20);
      setSuggestions(response.items || []);
      setIsOpen((response.items?.length ?? 0) > 0);
      setIsSearching(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [value]);

  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 選択された項目までスクロール
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectBook(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectBook = (book: GoogleBooksVolume) => {
    onSelectBook(book);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    if (value.length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="書籍名、著者名、ISBNで検索"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {suggestions.map((book, index) => (
            <button
              key={book.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              onClick={() => handleSelectBook(book)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium text-gray-900 line-clamp-1">{book.volumeInfo.title}</div>
              {book.volumeInfo.authors && book.volumeInfo.authors.length > 0 && (
                <div className="text-sm text-gray-600 line-clamp-1">
                  {book.volumeInfo.authors.join(', ')}
                </div>
              )}
              {book.volumeInfo.publishedDate && (
                <div className="text-xs text-gray-500 mt-1">{book.volumeInfo.publishedDate}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
