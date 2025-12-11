import { createMockCard } from '@/test/factories';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCardDetailView } from './useCardDetailView';
import { mockUseCardMutations, mockUseModal } from '@/test/mocks';
import { createTestUuid } from '@/test/helpers';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/cards/_hooks/useCardMutations');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
}));

describe('useCardDetailView', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('handleDelete', () => {
    const mockDeleteCard = vi.fn();

    beforeEach(() => {
      mockUseCardMutations({ deleteCard: mockDeleteCard });
      mockUseModal();
    });

    it('ユーザーが削除をキャンセルした場合、削除されない', () => {
      // 確認ダイアログを偽物にして、falseを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const card = createMockCard({ id: createTestUuid(1), book_id: createTestUuid(1) });

      const { result } = renderHook(() => useCardDetailView(card));

      // 削除を実行
      result.current.handleDelete(card.book_id, card.id);

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数は呼ばれていないことを確認（キャンセルしたから）
      expect(mockDeleteCard).not.toHaveBeenCalled();
    });

    it('ユーザーが削除をキャンセルしなかった場合、削除される', () => {
      // 確認ダイアログを偽物にして、trueを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const card = createMockCard({ id: createTestUuid(1), book_id: createTestUuid(1) });

      const { result } = renderHook(() => useCardDetailView(card));

      // 削除を実行
      result.current.handleDelete(card.book_id, card.id);

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数が正しい引数で呼ばれたことを確認
      expect(mockDeleteCard).toHaveBeenCalledWith(
        { bookId: createTestUuid(1), cardId: createTestUuid(1) },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });
  });

  describe('breadcrumbItems', () => {
    it('パンくずリストが正しく生成される', () => {
      const card = createMockCard({ title: 'テストカード' });

      const { result } = renderHook(() => useCardDetailView(card));

      expect(result.current.breadcrumbItems).toHaveLength(3);
      expect(result.current.breadcrumbItems[2].label).toBe('テストカード');
    });
  });

  describe('モーダル', () => {
    it('updateModal が返される', () => {
      mockUseModal();
      mockUseCardMutations();

      const card = createMockCard();
      const { result } = renderHook(() => useCardDetailView(card));

      expect(result.current.updateModal).toBeDefined();
    });
  });
});
