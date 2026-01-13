import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createMockCard } from '@/test/factories';
import { useCardForm } from './useCardForm';
import { createTestUuid } from '@/test/helpers';

const mockCreateCard = vi.fn();
const mockUpdateCard = vi.fn();
vi.mock('@/app/(protected)/cards/_hooks/useCardMutations', () => ({
  useCardMutations: vi.fn(() => ({
    createCard: mockCreateCard,
    updateCard: mockUpdateCard,
    isCreating: false,
    isUpdating: false,
  })),
}));

const mockCancel = vi.fn();
const mockCard = createMockCard();

const mockCardFormData = {
  book_id: mockCard.book_id,
  title: mockCard.title,
  content: mockCard.content,
  status_id: mockCard.status?.id,
};

describe('useCardForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('更新時', () => {
    it('updateCard が呼ばれる', () => {
      const { result } = renderHook(() =>
        useCardForm({ card: mockCard, bookId: mockCard.book_id, cancel: mockCancel }),
      );

      result.current.onSubmit(mockCardFormData);

      expect(mockUpdateCard).toHaveBeenCalledWith(
        {
          ...mockCardFormData,
          id: mockCard.id,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });

    it('cancel(モーダルを閉じる)が実行される', () => {
      const { result } = renderHook(() =>
        useCardForm({ card: mockCard, bookId: mockCard.book_id, cancel: mockCancel }),
      );

      result.current.onSubmit(mockCardFormData);
      expect(mockUpdateCard).toHaveBeenCalled();

      const onSuccessCallback = mockUpdateCard.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      expect(mockCancel).toHaveBeenCalled();
    });
  });

  describe('作成時', () => {
    it('createCard が呼ばれる', () => {
      const { result } = renderHook(() =>
        useCardForm({ bookId: createTestUuid(1), cancel: mockCancel }),
      );

      result.current.onSubmit(mockCardFormData);
      expect(mockCreateCard).toHaveBeenCalledWith(
        mockCardFormData,
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });

    it('cancel(モーダルを閉じる)が実行される', () => {
      const { result } = renderHook(() =>
        useCardForm({ bookId: createTestUuid(1), cancel: mockCancel }),
      );

      result.current.onSubmit(mockCardFormData);
      expect(mockCreateCard).toHaveBeenCalled();

      const onSuccessCallback = mockCreateCard.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      expect(mockCancel).toHaveBeenCalled();
    });
  });
});
