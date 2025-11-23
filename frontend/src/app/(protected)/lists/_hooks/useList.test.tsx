import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockList, createMockBook, createMockAuthor } from '@/test/factories';
import { useList } from './useList';
import { fetchList } from '@/app/(protected)/lists/_lib/fetchList';
import type { ListDetail } from '@/app/(protected)/lists/_types';

// fetchListをモック化
vi.mock('@/app/(protected)/lists/_lib/fetchList');

describe('useList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchListを呼び出してデータを取得する', async () => {
      const mockList: ListDetail = createMockList({
        id: 1,
        name: 'テストリスト',
        books: [
          createMockBook({
            id: 1,
            title: 'テスト本',
            authors: [createMockAuthor({ id: 1, name: 'テスト著者' })],
          }),
        ],
        list_books: [{ id: 1, list_id: 1, book_id: 1 }],
      });

      vi.mocked(fetchList).mockResolvedValue(mockList);

      const { result } = renderHook(() => useList(1), {
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
      expect(result.current.data).toEqual(mockList);

      // fetchListが正しい引数で呼ばれたことを確認
      expect(fetchList).toHaveBeenCalledWith(1);
      expect(fetchList).toHaveBeenCalledTimes(1);
    });

    it('idが0の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useList(0), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchListが呼ばれていないことを確認
      expect(fetchList).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchListがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchList).mockRejectedValue(new Error('リスト詳細の取得に失敗しました'));

      const { result } = renderHook(() => useList(1), {
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
      expect(result.current.error?.message).toBe('リスト詳細の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchList).mockResolvedValue(createMockList());

      const { result } = renderHook(() => useList(42), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // fetchListが正しいidで呼ばれたことを確認
      expect(fetchList).toHaveBeenCalledWith(42);
    });
  });
});
