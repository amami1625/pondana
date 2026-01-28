import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { useCardMutations } from './useCardMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCardMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCard', () => {
    const createData = {
      book_id: createTestUuid(1),
      title: 'テストカード',
      content: 'テスト本文',
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createCard(createData);
      });

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('カードを作成しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createCard(createData);
      });

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('updateCard', () => {
    const updateData = {
      id: createTestUuid(1),
      title: 'テストカード',
      content: 'テスト本文',
      book_id: createTestUuid(1),
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateCard(updateData);
      });

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('カードを更新しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateCard(updateData);
      });

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('deleteCard', () => {
    const bookId = createTestUuid(1);
    const cardId = createTestUuid(2);

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteCard({ cardId, bookId });
      });

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('カードを削除しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.delete('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteCard({ cardId, bookId });
      });

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });
});
