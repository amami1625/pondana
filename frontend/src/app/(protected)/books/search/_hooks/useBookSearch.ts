import { useCallback, useRef } from 'react';
import { GoogleBooksVolume } from '@/app/(protected)/books/_types';
import { useBookSearchApi } from '@/app/(protected)/books/search/_hooks/useBookSearchApi';
import { useBookSuggestions } from '@/app/(protected)/books/search/_hooks/useBookSuggestions';
import { useOnClickOutside } from '@/app/(protected)/books/search/_hooks/useOnClickOutside';
import { useAutoScrollIntoView } from '@/app/(protected)/books/search/_hooks/useAutoScrollIntoView';

export function useBookSearch(onSelectBook: (book: GoogleBooksVolume) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 検索API（デバウンス付き）
  const { query, setQuery, suggestions, isLoading } = useBookSearchApi();

  //サジェスト操作（開閉・選択・キー操作）
  const { isOpen, setIsOpen, selectedIndex, handleKeyDown, handleClickItem } = useBookSuggestions(
    suggestions,
    (book) => {
      // Enter / クリックで選択されたときに親へ通知
      onSelectBook(book);
      inputRef.current?.blur();
    },
  );

  // 外部クリックで閉じる
  const onClickOutside = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // isOpen が true のときだけイベントリスナーを登録（パフォーマンス最適化）
  useOnClickOutside(inputRef, dropdownRef, onClickOutside, isOpen);

  // 選択された項目までスクロール
  useAutoScrollIntoView(selectedIndex, itemRefs, isOpen);

  // フォームフォーカス時、検索結果(suggestions)があれば開く
  const handleFocus = () => {
    if (query.trim().length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return {
    // State
    query,
    suggestions,
    isOpen,
    selectedIndex,
    isLoading,

    // Refs
    inputRef,
    dropdownRef,
    itemRefs,

    // Handlers
    setQuery,
    handleKeyDown,
    handleFocus,
    handleClickItem,
  };
}
