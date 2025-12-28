import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockTag } from '@/test/factories/tag';
import { useTagMutations } from './useTagMutations';
import toast from 'react-hot-toast';
import { createMockBook, createMockTopPageData } from '@/test/factories';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useTagMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTag', () => {
    it('タグの作成が成功する', async () => {
      const mockTag = createMockTag({ name: 'テストタグ' });
      const queryClient = createTestQueryClient();

      // 事前に tags のデータをキャッシュに追加
      queryClient.setQueryData(['tags'], [createMockTag({ id: 1 })]);

      server.use(
        http.post('/api/tags', async () => {
          return HttpResponse.json(mockTag, { status: 201 });
        }),
      );

      const { result } = renderHook(() => useTagMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createTag({
          name: 'テストタグ',
        });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('タグを作成しました');

      // キャッシュが無効化されることを確認
      const tagsQueryState = queryClient.getQueryState(['tags']);
      expect(tagsQueryState?.isInvalidated).toBe(true);
    });

    it('タグの作成が失敗する', async () => {
      const errorMessage = 'タグの作成に失敗しました';

      server.use(
        http.post('/api/tags', () => {
          return HttpResponse.json(
            {
              code: 'CREATE_FAILED',
              error: errorMessage,
            },
            { status: 422 },
          );
        }),
      );

      const { result } = renderHook(() => useTagMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createTag({
          name: 'テストタグ',
        });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateTag', () => {
    it('タグの更新が成功する', async () => {
      const mockTag = createMockTag({ id: 1, name: 'テストタグ' });
      const queryClient = createTestQueryClient();

      // 事前に tags と books, top のデータをキャッシュに追加
      queryClient.setQueryData(['tags'], [createMockTag({ id: 1 })]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      server.use(
        http.put('/api/tags/:id', async () => {
          return HttpResponse.json(mockTag);
        }),
      );

      const { result } = renderHook(() => useTagMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateTag({
          id: 1,
          name: 'テストタグ',
        });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('タグを更新しました');

      // キャッシュが無効化されることを確認
      const tagsQueryState = queryClient.getQueryState(['tags']);
      expect(tagsQueryState?.isInvalidated).toBe(true);
      const booksQueryState = queryClient.getQueryState(['books']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('タグの更新が失敗する', async () => {
      const errorMessage = 'タグの更新に失敗しました';

      server.use(
        http.put('/api/tags/:id', () => {
          return HttpResponse.json(
            {
              code: 'UPDATE_FAILED',
              error: errorMessage,
            },
            { status: 422 },
          );
        }),
      );

      const { result } = renderHook(() => useTagMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateTag({
          id: 1,
          name: 'テストタグ',
        });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteTag', () => {
    it('タグの削除が成功する', async () => {
      const queryClient = createTestQueryClient();

      // 事前に tags と books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['tags'], [createMockTag({ id: 1 })]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      server.use(
        http.delete('/api/tags/:id', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const { result } = renderHook(() => useTagMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteTag({ id: 1 }));

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('タグを削除しました');

      // キャッシュが無効化されることを確認
      const tagsQueryState = queryClient.getQueryState(['tags']);
      expect(tagsQueryState?.isInvalidated).toBe(true);
      const booksQueryState = queryClient.getQueryState(['books']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('タグの削除に失敗する', async () => {
      const errorMessage = 'タグの削除に失敗しました';

      server.use(
        http.delete('/api/tags/:id', () => {
          return HttpResponse.json(
            {
              code: 'DELETE_FAILED',
              error: errorMessage,
            },
            { status: 422 },
          );
        }),
      );

      const { result } = renderHook(() => useTagMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteTag({ id: 1 }));

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);
    });
  });
});
