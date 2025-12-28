import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient, createTestUuid } from '@/test/helpers';
import { createMockList, createMockBook, createMockTopPageData } from '@/test/factories';
import toast from 'react-hot-toast';
import { useListMutations } from './useListMutations';
import { createList, updateList, deleteList } from '../_lib/mutation';

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

// ミューテーション関数をモック
vi.mock('../_lib/mutation');

describe('useListMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createList', () => {
    it('リストの作成に成功し、適切な副作用が実行される', async () => {
      const mockList = createMockList({ name: 'テストリスト', description: 'テスト説明' });
      const queryClient = createTestQueryClient();

      // 事前にlists、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.mocked(createList).mockResolvedValue(mockList);

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isCreating).toBe(false);

      act(() =>
        result.current.createList({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // createListが正しい引数で呼ばれたことを確認
      expect(createList).toHaveBeenCalledWith(
        {
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        },
        expect.any(Object),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストを作成しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('リストの作成に失敗し、エラートーストが表示される', async () => {
      const errorMessage = 'リストの作成に失敗しました';
      vi.mocked(createList).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isCreating).toBe(false);

      act(() =>
        result.current.createList({
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(createList).toHaveBeenCalledWith(
        {
          name: 'テストリスト',
          description: 'テスト説明',
          public: true,
        },
        expect.any(Object),
      );

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);
    });
  });

  describe('updateList', () => {
    it('リストの更新に成功し、適切な副作用が実行される', async () => {
      const mockList = createMockList({
        id: createTestUuid(1),
        name: '更新されたリスト',
        description: '更新された説明',
      });
      const queryClient = createTestQueryClient();

      // 事前にlists、list detail、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(
        ['lists', 'detail', createTestUuid(1)],
        createMockList({ id: createTestUuid(1) }),
      );
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.mocked(updateList).mockResolvedValue(mockList);

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isUpdating).toBe(false);

      act(() =>
        result.current.updateList({
          id: createTestUuid(1),
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // updateListが正しい引数で呼ばれたことを確認
      expect(updateList).toHaveBeenCalledWith(
        {
          id: createTestUuid(1),
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        },
        expect.any(Object),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストを更新しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const listDetailQueryState = queryClient.getQueryState([
        'lists',
        'detail',
        createTestUuid(1),
      ]);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(listDetailQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('リストの更新に失敗し、エラートーストが表示される', async () => {
      const errorMessage = 'リストの更新に失敗しました';
      vi.mocked(updateList).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);

      act(() =>
        result.current.updateList({
          id: createTestUuid(1),
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        }),
      );

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(updateList).toHaveBeenCalledWith(
        {
          id: createTestUuid(1),
          name: '更新されたリスト',
          description: '更新された説明',
          public: true,
        },
        expect.any(Object),
      );

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);
    });
  });

  describe('deleteList', () => {
    it('リストの削除に成功し、適切な副作用が実行される', async () => {
      const queryClient = createTestQueryClient();

      // 事前にlists、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.mocked(deleteList).mockResolvedValue(undefined);

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isDeleting).toBe(false);

      act(() => result.current.deleteList(createTestUuid(1)));

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // deleteListが正しい引数で呼ばれたことを確認
      expect(deleteList).toHaveBeenCalledWith(createTestUuid(1), expect.any(Object));

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

    it('リストの削除に失敗し、エラートーストが表示される', async () => {
      const errorMessage = 'リストの削除に失敗しました';
      vi.mocked(deleteList).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useListMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isDeleting).toBe(false);

      act(() => result.current.deleteList(createTestUuid(1)));

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(deleteList).toHaveBeenCalledWith(createTestUuid(1), expect.any(Object));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);

      // リダイレクトされないことを確認
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
