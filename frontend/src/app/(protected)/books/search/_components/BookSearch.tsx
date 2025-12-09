'use client';

import type { GoogleBooksVolume } from '@/app/(protected)/books/_types';
import { useBookSearch } from '@/app/(protected)/books/search/_hooks/useBookSearch';

interface BookSearchAutocompleteProps {
  onSelectBook: (book: GoogleBooksVolume) => void;
}

export default function BookSearch({ onSelectBook }: BookSearchAutocompleteProps) {
  const {
    query,
    suggestions,
    isOpen,
    selectedIndex,
    isLoading,
    inputRef,
    dropdownRef,
    itemRefs,
    setQuery,
    handleKeyDown,
    handleFocus,
    handleClickItem,
  } = useBookSearch(onSelectBook);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="書籍名、著者名、ISBNで検索"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
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
              onClick={() => handleClickItem(index)}
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
