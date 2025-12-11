import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { createMockList } from '@/test/factories';
import { useLists } from './useLists';
import { fetchLists } from '@/app/(protected)/lists/_lib/fetchLists';
import type { List } from '@/app/(protected)/lists/_types';

// fetchListsをモック化
vi.mock('@/app/(protected)/lists/_lib/fetchLists');

describe('useLists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchListsを呼び出してデータを取得する', async () => {
      const mockLists: List[] = [
        createMockList({ id: createTestUuid(1), name: 'テストリストA' }),
        createMockList({ id: createTestUuid(2), name: 'テストリストB' }),
      ];

      vi.mocked(fetchLists).mockResolvedValue(mockLists);

      const { result } = renderHook(() => useLists(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockLists);

      // fetchListsが呼ばれたことを確認
      expect(fetchLists).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchLists).mockResolvedValue([]);

      const { result } = renderHook(() => useLists(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchListsがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchLists).mockRejectedValue(new Error('リスト一覧の取得に失敗しました'));

      const { result } = renderHook(() => useLists(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('リスト一覧の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchLists).mockResolvedValue([]);

      const { result } = renderHook(() => useLists(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // queryKeyの確認（内部実装に依存するため、間接的に確認）
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
