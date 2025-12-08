import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createMockGoogleBooksVolume } from '@/test/factories';
import { useBookSearchPage } from './useBookSearchPage';

describe('useBookSearchPage', () => {
  const mockBook = createMockGoogleBooksVolume();

  describe('初期状態', () => {
    it('selectedBook が nullである', () => {
      const { result } = renderHook(() => useBookSearchPage());

      expect(result.current.selectedBook).toBeNull();
    });

    it('handleSelectBook が提供される', () => {
      const { result } = renderHook(() => useBookSearchPage());

      expect(typeof result.current.handleSelectBook).toBe('function');
    });

    it('handleClearSelection が提供される', () => {
      const { result } = renderHook(() => useBookSearchPage());

      expect(typeof result.current.handleClearSelection).toBe('function');
    });
  });

  describe('handleSelectBook', () => {
    it('書籍を選択できる', () => {
      const { result } = renderHook(() => useBookSearchPage());

      act(() => {
        result.current.handleSelectBook(mockBook);
      });

      expect(result.current.selectedBook).toEqual(mockBook);
    });

    it('選択済みの書籍を別の書籍に変更できる', () => {
      const { result } = renderHook(() => useBookSearchPage());

      const anotherBook = createMockGoogleBooksVolume({
        id: 'another-book-id',
        volumeInfo: {
          ...mockBook.volumeInfo,
          title: '別の書籍',
        },
      });

      act(() => {
        result.current.handleSelectBook(mockBook);
      });

      expect(result.current.selectedBook?.id).toBe('test-book-id');

      act(() => {
        result.current.handleSelectBook(anotherBook);
      });

      expect(result.current.selectedBook?.id).toBe('another-book-id');
      expect(result.current.selectedBook?.volumeInfo.title).toBe('別の書籍');
    });
  });

  describe('handleClearSelection', () => {
    it('選択された書籍をクリアできる', () => {
      const { result } = renderHook(() => useBookSearchPage());

      // まず書籍を選択
      act(() => {
        result.current.handleSelectBook(mockBook);
      });

      expect(result.current.selectedBook).toEqual(mockBook);

      // クリア
      act(() => {
        result.current.handleClearSelection();
      });

      expect(result.current.selectedBook).toBeNull();
    });

    it('selectedBook が null の状態でクリアしてもエラーにならない', () => {
      const { result } = renderHook(() => useBookSearchPage());

      expect(result.current.selectedBook).toBeNull();

      act(() => {
        result.current.handleClearSelection();
      });

      expect(result.current.selectedBook).toBeNull();
    });
  });
});
