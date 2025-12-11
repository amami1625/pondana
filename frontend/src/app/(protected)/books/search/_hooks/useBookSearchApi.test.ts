import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookSearchApi } from '@/app/(protected)/books/search/_hooks/useBookSearchApi';
import { searchBooks } from '@/lib/googleBooksApi';
import { createMockGoogleBooksVolume } from '@/test/factories';
import { GoogleBooksResponse } from '../../_types';

vi.mock('@/lib/googleBooksApi', () => ({
  searchBooks: vi.fn(),
}));

describe('useBookSearchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers(); // タイマーをモック化
  });

  afterEach(() => {
    vi.useRealTimers(); // 実際のタイマーに戻す
  });

  describe('初期状態', () => {
    it('query が空文字列であること', () => {
      const { result } = renderHook(() => useBookSearchApi());
      expect(result.current.query).toBe('');
    });

    it('suggestions が空配列であること', () => {
      const { result } = renderHook(() => useBookSearchApi());
      expect(result.current.suggestions).toEqual([]);
    });

    it('isLoading が false であること', () => {
      const { result } = renderHook(() => useBookSearchApi());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useEffect: query の変更', () => {
    it('query が 2 文字未満の場合、suggestions が空配列になること', () => {
      const { result } = renderHook(() => useBookSearchApi());

      // 初期状態
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.isLoading).toBe(false);

      // 2 文字未満に設定
      act(() => {
        result.current.setQuery('a');
      });

      expect(result.current.suggestions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('query が 2 文字以上の場合、デバウンス後に検索APIが呼ばれる', async () => {
      const mockBook1 = createMockGoogleBooksVolume({ id: 'book-1' });
      const mockBook2 = createMockGoogleBooksVolume({ id: 'book-2' });
      const mockResponse = {
        kind: 'books#volumes',
        items: [mockBook1, mockBook2],
        totalItems: 2,
      };

      // searchBooks をモック化
      vi.mocked(searchBooks).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBookSearchApi());

      // 初期状態
      expect(result.current.isLoading).toBe(false);

      // 2 文字以上に設定
      act(() => {
        result.current.setQuery('test');
      });

      // isLoading が true になる
      expect(result.current.isLoading).toBe(true);

      // タイマーとPromiseを全て実行
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // searchBooks が呼ばれる
      expect(searchBooks).toHaveBeenCalledWith('test', 20);

      // suggestions が設定される
      expect(result.current.suggestions).toEqual([mockBook1, mockBook2]);

      // isLoading が false になる
      expect(result.current.isLoading).toBe(false);
    });

    it('query が変更されたら、前のタイマーがキャンセルされる（デバウンス）', async () => {
      const mockBook = createMockGoogleBooksVolume();
      const mockResponse = {
        kind: 'books#volumes',
        items: [mockBook],
        totalItems: 1,
      };

      vi.mocked(searchBooks).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBookSearchApi());

      // 最初のクエリを設定
      act(() => {
        result.current.setQuery('te');
      });

      expect(result.current.isLoading).toBe(true);

      // 500ms 経過（まだデバウンス時間内）
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // まだ searchBooks は呼ばれていない
      expect(searchBooks).not.toHaveBeenCalled();

      // クエリを変更（前のタイマーがキャンセルされる）
      act(() => {
        result.current.setQuery('test');
      });

      // さらに 500ms 経過（合計 1000ms だが、2回目のクエリからは 500ms）
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // まだ searchBooks は呼ばれていない（2回目のクエリから 1000ms 経っていない）
      expect(searchBooks).not.toHaveBeenCalled();

      // さらに 500ms 経過（2回目のクエリから 1000ms）
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // searchBooks が 'test' で呼ばれる（'te' では呼ばれない）
      expect(searchBooks).toHaveBeenCalledTimes(1);
      expect(searchBooks).toHaveBeenCalledWith('test', 20);
    });

    it('Google Books API でデータの取得に失敗した場合、suggestions は空配列になり isLoading が false になる', async () => {
      const mockResponse = {
        kind: 'books#volumes',
        totalItems: 0,
        items: [],
      };

      vi.mocked(searchBooks).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBookSearchApi());

      // クエリを設定
      act(() => {
        result.current.setQuery('test');
      });

      expect(result.current.isLoading).toBe(true);

      // タイマーとPromiseを全て実行
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // searchBooks が呼ばれる
      expect(searchBooks).toHaveBeenCalledWith('test', 20);

      // suggestions が空配列になる
      expect(result.current.suggestions).toEqual([]);

      // isLoading が false になる
      expect(result.current.isLoading).toBe(false);
    });

    it('API が items なしのレスポンスを返した場合、suggestions は空配列になる', async () => {
      // items が undefined のレスポンス
      const mockResponse = {
        kind: 'books#volumes',
        totalItems: 0,
      };

      vi.mocked(searchBooks).mockResolvedValue(mockResponse as GoogleBooksResponse);

      const { result } = renderHook(() => useBookSearchApi());

      // クエリを設定
      act(() => {
        result.current.setQuery('test');
      });

      // タイマーとPromiseを全て実行
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // response.items || [] により、suggestions が空配列になる
      expect(result.current.suggestions).toEqual([]);

      expect(result.current.isLoading).toBe(false);
    });
  });
});
