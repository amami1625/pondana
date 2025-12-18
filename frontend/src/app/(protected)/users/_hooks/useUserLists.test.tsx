import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { createMockList } from '@/test/factories';
import { useUserLists } from './useUserLists';
import { fetchUserLists } from '@/app/(protected)/users/_lib/fetchUserLists';

// fetchUserListsをモック化
vi.mock('@/app/(protected)/users/_lib/fetchUserLists');

describe('useUserLists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchUserListsを呼び出してデータを取得する', async () => {
      const mockLists = [
        createMockList({
          id: createTestUuid(1),
          name: 'テストリスト1',
          public: true,
        }),
        createMockList({
          id: createTestUuid(2),
          name: 'テストリスト2',
          public: true,
        }),
      ];

      vi.mocked(fetchUserLists).mockResolvedValue(mockLists);

      const { result } = renderHook(() => useUserLists('1'), {
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
      expect(result.current.data).toHaveLength(2);

      // fetchUserListsが正しい引数で呼ばれたことを確認
      expect(fetchUserLists).toHaveBeenCalledWith('1');
      expect(fetchUserLists).toHaveBeenCalledTimes(1);
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useUserLists(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchUserListsが呼ばれていないことを確認
      expect(fetchUserLists).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchUserListsがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchUserLists).mockRejectedValue(
        new Error('ユーザーの公開リスト一覧の取得に失敗しました'),
      );

      const { result } = renderHook(() => useUserLists('1'), {
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
      expect(result.current.error?.message).toBe('ユーザーの公開リスト一覧の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchUserLists).mockResolvedValue([]);

      const { result } = renderHook(() => useUserLists('42'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // fetchUserListsが正しいidで呼ばれたことを確認
      expect(fetchUserLists).toHaveBeenCalledWith('42');
    });
  });
});
