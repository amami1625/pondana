import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUserSearchApi } from './useUserSearchApi';
import { createMockUser } from '@/test/factories';

describe('useUserSearchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('初期状態', () => {
    it('query が空文字列であること', () => {
      const { result } = renderHook(() => useUserSearchApi());
      expect(result.current.query).toBe('');
    });

    it('suggestions が空配列であること', () => {
      const { result } = renderHook(() => useUserSearchApi());
      expect(result.current.suggestions).toEqual([]);
    });

    it('isLoading が false であること', () => {
      const { result } = renderHook(() => useUserSearchApi());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useEffect: query の変更', () => {
    it('query が 2 文字未満の場合、suggestions が空配列になること', () => {
      const { result } = renderHook(() => useUserSearchApi());

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
      const mockUsers = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440000', name: 'testA' }),
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'testB' }),
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockUsers,
        }),
      );
      const { result } = renderHook(() => useUserSearchApi());

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

      // fetch API が呼ばれる
      expect(fetch).toHaveBeenCalledWith('/api/users?q=test');

      // suggestions が設定される
      expect(result.current.suggestions).toEqual(mockUsers);

      // isLoading が false になる
      expect(result.current.isLoading).toBe(false);
    });

    it('query が変更されたら、前のタイマーがキャンセルされる（デバウンス）', async () => {
      const mockUsers = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440000', name: 'testA' }),
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'testB' }),
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockUsers,
        }),
      );
      const { result } = renderHook(() => useUserSearchApi());

      // 最初のクエリを設定
      act(() => {
        result.current.setQuery('test');
      });

      expect(result.current.isLoading).toBe(true);

      // 500ms 経過（まだデバウンス時間内）
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // クエリを変更（前のタイマーがキャンセルされる）
      act(() => {
        result.current.setQuery('testA');
      });

      // さらに 500ms 経過（合計 1000ms だが、2回目のクエリからは 500ms）
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // まだ fetch は呼ばれていない（2回目のクエリから 1000ms 経っていない）
      expect(fetch).not.toHaveBeenCalled();

      // さらに 500ms 経過（2回目のクエリから 1000ms）
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // fetch が 'testA' で呼ばれる（'test' では呼ばれない）
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/users?q=testA');
    });
  });

  describe('異常系: fetch API のエラー', () => {
    it('検索エラー時は空配列が返される', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('エラーです')));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useUserSearchApi());

      act(() => {
        result.current.setQuery('test');
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(fetch).toHaveBeenCalledWith('/api/users?q=test');
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('User search error:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});
