import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockList, createMockBook, createMockTopPageData } from '@/test/factories';
import toast from 'react-hot-toast';
import { useListMutations } from './useListMutations';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// next/navigationをモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('useListMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createList', () => {
    it('リストの作成に成功する', async () => {
      const mockList = createMockList({ name: 'テストリスト', description: 'テスト説明' });
      const queryClient = createTestQueryClient();

      // 事前にlists、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockList,
        }),
      );

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      act(() =>
        result.current.createList({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストを作成しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('リストの作成に失敗する', async () => {
      const errorMessage = 'リストの作成に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      act(() =>
        result.current.createList({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      act(() =>
        result.current.createList({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateList', () => {
    it('リストの更新に成功する', async () => {
      const mockList = createMockList({
        id: 1,
        name: '更新されたリスト',
        description: '更新された説明',
      });
      const queryClient = createTestQueryClient();

      // 事前にlists、list detail、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['lists', 'detail', 1], createMockList({ id: 1 }));
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockList,
        }),
      );

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() =>
        result.current.updateList({
          id: 1,
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストを更新しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const listDetailQueryState = queryClient.getQueryState(['lists', 'detail', 1]);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(listDetailQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('リストの更新に失敗する', async () => {
      const errorMessage = 'リストの更新に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() =>
        result.current.updateList({
          id: 1,
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() =>
        result.current.updateList({
          id: 1,
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);
    });
  });

  describe('deleteList', () => {
    it('リストの削除に成功する', async () => {
      const mockList = createMockList({ id: 1 });
      const queryClient = createTestQueryClient();

      // 事前にlists、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockList,
        }),
      );

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteList(1));

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストを削除しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);

      // 一覧ページにリダイレクトされることを確認
      expect(mockPush).toHaveBeenCalledWith('/lists');
    });

    it('リストの削除に失敗する', async () => {
      const errorMessage = 'リストの削除に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteList(1));

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);

      // リダイレクトされないことを確認
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteList(1));

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);

      // リダイレクトされないことを確認
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
