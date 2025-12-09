import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookSearch } from '@/app/(protected)/books/search/_hooks/useBookSearch';
import { useBookSearchApi } from '@/app/(protected)/books/search/_hooks/useBookSearchApi';
import { useBookSuggestions } from '@/app/(protected)/books/search/_hooks/useBookSuggestions';
import { useOnClickOutside } from '@/app/(protected)/books/search/_hooks/useOnClickOutside';
import { useAutoScrollIntoView } from '@/app/(protected)/books/search/_hooks/useAutoScrollIntoView';
import { createMockGoogleBooksVolume } from '@/test/factories';

// 子フックをモックして、このフック固有のロジックだけをテスト
vi.mock('@/app/(protected)/books/search/_hooks/useBookSearchApi');
vi.mock('@/app/(protected)/books/search/_hooks/useBookSuggestions');
vi.mock('@/app/(protected)/books/search/_hooks/useOnClickOutside');
vi.mock('@/app/(protected)/books/search/_hooks/useAutoScrollIntoView');

describe('useBookSearch', () => {
  const mockOnSelectBook = vi.fn();
  const mockSetQuery = vi.fn();
  const mockSetIsOpen = vi.fn();
  const mockHandleKeyDown = vi.fn();
  const mockHandleClickItem = vi.fn();
  const mockBook = createMockGoogleBooksVolume({ id: 'book-1' });

  beforeEach(() => {
    vi.clearAllMocks();

    // useBookSearchApi のモック
    vi.mocked(useBookSearchApi).mockReturnValue({
      query: '',
      setQuery: mockSetQuery,
      suggestions: [],
      isLoading: false,
    });

    // useBookSuggestions のモック
    vi.mocked(useBookSuggestions).mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen,
      selectedIndex: -1,
      handleKeyDown: mockHandleKeyDown,
      handleClickItem: mockHandleClickItem,
    });

    // useOnClickOutside と useAutoScrollIntoView のモック（何もしない）
    vi.mocked(useOnClickOutside).mockImplementation(() => {});
    vi.mocked(useAutoScrollIntoView).mockImplementation(() => {});
  });

  describe('onSelectBook と blur() の統合', () => {
    it('useBookSuggestions に渡すコールバックで onSelectBook と blur() が呼ばれる', () => {
      // useBookSuggestions が受け取ったコールバックを取得
      let onSelectCallback: ((book: typeof mockBook) => void) | undefined;

      vi.mocked(useBookSuggestions).mockImplementation((suggestions, callback) => {
        onSelectCallback = callback;
        return {
          isOpen: false,
          setIsOpen: mockSetIsOpen,
          selectedIndex: -1,
          handleKeyDown: mockHandleKeyDown,
          handleClickItem: mockHandleClickItem,
        };
      });

      const mockBlur = vi.fn();
      const { result } = renderHook(() => useBookSearch(mockOnSelectBook));

      // inputRef を設定
      result.current.inputRef.current = {
        blur: mockBlur,
      } as unknown as HTMLInputElement;

      // useBookSuggestions に渡されたコールバックを実行
      act(() => {
        onSelectCallback?.(mockBook);
      });

      // onSelectBook が呼ばれる
      expect(mockOnSelectBook).toHaveBeenCalledWith(mockBook);
      // blur() が呼ばれる
      expect(mockBlur).toHaveBeenCalled();
    });

    it('inputRef.current が null の場合でもエラーにならない', () => {
      let onSelectCallback: ((book: typeof mockBook) => void) | undefined;

      vi.mocked(useBookSuggestions).mockImplementation((suggestions, callback) => {
        onSelectCallback = callback;
        return {
          isOpen: false,
          setIsOpen: mockSetIsOpen,
          selectedIndex: -1,
          handleKeyDown: mockHandleKeyDown,
          handleClickItem: mockHandleClickItem,
        };
      });

      const { result } = renderHook(() => useBookSearch(mockOnSelectBook));

      // inputRef.current は null のまま
      expect(result.current.inputRef.current).toBeNull();

      // エラーにならないことを確認
      expect(() => {
        act(() => {
          onSelectCallback?.(mockBook);
        });
      }).not.toThrow();

      // onSelectBook は呼ばれる
      expect(mockOnSelectBook).toHaveBeenCalledWith(mockBook);
    });
  });

  describe('onClickOutside', () => {
    it('onClickOutside で setIsOpen(false) が呼ばれる', () => {
      vi.mocked(useBookSuggestions).mockReturnValue({
        isOpen: true,
        setIsOpen: mockSetIsOpen,
        selectedIndex: 0,
        handleKeyDown: mockHandleKeyDown,
        handleClickItem: mockHandleClickItem,
      });

      renderHook(() => useBookSearch(mockOnSelectBook));

      const onClickOutside = vi.mocked(useOnClickOutside).mock.calls[0][2];

      // onClickOutside を実行
      act(() => {
        onClickOutside();
      });

      // setIsOpen(false) が呼ばれる
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('handleFocus', () => {
    it('query が 2 文字以上で suggestions がある場合、setIsOpen(true) が呼ばれる', () => {
      vi.mocked(useBookSearchApi).mockReturnValue({
        query: 'test',
        setQuery: mockSetQuery,
        suggestions: [mockBook],
        isLoading: false,
      });

      const { result } = renderHook(() => useBookSearch(mockOnSelectBook));

      act(() => {
        result.current.handleFocus();
      });

      expect(mockSetIsOpen).toHaveBeenCalledWith(true);
    });

    it('query が 2 文字未満の場合、setIsOpen は呼ばれない', () => {
      vi.mocked(useBookSearchApi).mockReturnValue({
        query: 'a',
        setQuery: mockSetQuery,
        suggestions: [mockBook],
        isLoading: false,
      });

      const { result } = renderHook(() => useBookSearch(mockOnSelectBook));

      act(() => {
        result.current.handleFocus();
      });

      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it('query が空白のみの場合、setIsOpen は呼ばれない', () => {
      vi.mocked(useBookSearchApi).mockReturnValue({
        query: '   ',
        setQuery: mockSetQuery,
        suggestions: [mockBook],
        isLoading: false,
      });

      const { result } = renderHook(() => useBookSearch(mockOnSelectBook));

      act(() => {
        result.current.handleFocus();
      });

      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it('suggestions が空の場合、setIsOpen は呼ばれない', () => {
      vi.mocked(useBookSearchApi).mockReturnValue({
        query: 'test',
        setQuery: mockSetQuery,
        suggestions: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useBookSearch(mockOnSelectBook));

      act(() => {
        result.current.handleFocus();
      });

      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });
  });

  describe('DOM 操作フックの統合', () => {
    it('useOnClickOutside が正しいパラメータで呼ばれる', () => {
      vi.mocked(useBookSuggestions).mockReturnValue({
        isOpen: true,
        setIsOpen: mockSetIsOpen,
        selectedIndex: 0,
        handleKeyDown: mockHandleKeyDown,
        handleClickItem: mockHandleClickItem,
      });

      renderHook(() => useBookSearch(mockOnSelectBook));

      // useOnClickOutside が呼ばれることを確認
      expect(useOnClickOutside).toHaveBeenCalled();

      // 呼び出しパラメータを検証
      const calls = vi.mocked(useOnClickOutside).mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      const [inputRef, dropdownRef, onClickOutside, isOpen] = calls[calls.length - 1];
      expect(inputRef).toBeDefined();
      expect(dropdownRef).toBeDefined();
      expect(typeof onClickOutside).toBe('function');
      expect(isOpen).toBe(true); // isOpen が true
    });

    it('useAutoScrollIntoView が正しいパラメータで呼ばれる', () => {
      vi.mocked(useBookSuggestions).mockReturnValue({
        isOpen: true,
        setIsOpen: mockSetIsOpen,
        selectedIndex: 2,
        handleKeyDown: mockHandleKeyDown,
        handleClickItem: mockHandleClickItem,
      });

      renderHook(() => useBookSearch(mockOnSelectBook));

      // useAutoScrollIntoView が呼ばれることを確認
      expect(useAutoScrollIntoView).toHaveBeenCalled();

      // 呼び出しパラメータを検証
      const calls = vi.mocked(useAutoScrollIntoView).mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      const [selectedIndex, itemRefs, isOpen] = calls[calls.length - 1];
      expect(selectedIndex).toBe(2);
      expect(itemRefs).toBeDefined();
      expect(isOpen).toBe(true);
    });
  });
});
