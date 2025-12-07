import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookSelection } from './useBookSelection';
import type { GoogleBooksVolume } from '../../_types';
import { createMockGoogleBooksVolume } from '@/test/factories';

describe('useBookSelection', () => {
  // const mockBook: GoogleBooksVolume = {
  //   id: 'test-book-id',
  //   volumeInfo: {
  //     title: 'テスト書籍',
  //     subtitle: 'サブタイトル',
  //     authors: ['テスト著者'],
  //     publishedDate: '2024-01-01',
  //     description: 'テスト用の説明',
  //     industryIdentifiers: [
  //       {
  //         type: 'ISBN_13',
  //         identifier: '9784873117836',
  //       },
  //     ],
  //     imageLinks: {
  //       thumbnail: 'http://example.com/image.jpg',
  //     },
  //   },
  // };

  const mockBook = createMockGoogleBooksVolume();

  describe('初期状態', () => {
    it('selectedBook が nullである', () => {
      const { result } = renderHook(() => useBookSelection());

      expect(result.current.selectedBook).toBeNull();
    });

    it('handleSelectBook が提供される', () => {
      const { result } = renderHook(() => useBookSelection());

      expect(typeof result.current.handleSelectBook).toBe('function');
    });

    it('handleClearSelection が提供される', () => {
      const { result } = renderHook(() => useBookSelection());

      expect(typeof result.current.handleClearSelection).toBe('function');
    });
  });

  describe('handleSelectBook', () => {
    it('書籍を選択できる', () => {
      const { result } = renderHook(() => useBookSelection());

      act(() => {
        result.current.handleSelectBook(mockBook);
      });

      expect(result.current.selectedBook).toEqual(mockBook);
    });

    it('選択済みの書籍を別の書籍に変更できる', () => {
      const { result } = renderHook(() => useBookSelection());

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
      const { result } = renderHook(() => useBookSelection());

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
      const { result } = renderHook(() => useBookSelection());

      expect(result.current.selectedBook).toBeNull();

      act(() => {
        result.current.handleClearSelection();
      });

      expect(result.current.selectedBook).toBeNull();
    });
  });

});
