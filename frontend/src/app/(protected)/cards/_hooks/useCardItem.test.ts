import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createMockCard } from '@/test/factories';
import { useCardItem } from './useCardItem';

// Next.jsのuseRouterをモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

const mockDeleteCard = vi.fn();
vi.mock('@/app/(protected)/cards/_hooks/useCardMutations', () => ({
  useCardMutations: vi.fn(() => ({
    deleteCard: mockDeleteCard,
  })),
}));

const mockCard = createMockCard();

describe('useCardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('削除確認でキャンセルした場合、deleteCard が呼ばれない', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    const { result } = renderHook(() => useCardItem(mockCard));

    result.current.handleDelete();

    expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');
    expect(mockDeleteCard).not.toHaveBeenCalled();
  });

  it('削除確認で OK した場合、deleteCard が呼ばれる', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { result } = renderHook(() => useCardItem(mockCard));

    result.current.handleDelete();

    expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');
    expect(mockDeleteCard).toHaveBeenCalledWith(
      { bookId: mockCard.book_id, cardId: mockCard.id },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it('削除完了後、カード一覧ページへ遷移する', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { result } = renderHook(() => useCardItem(mockCard));

    result.current.handleDelete();

    expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');
    expect(mockDeleteCard).toHaveBeenCalled();

    // onSuccess コールバックを取得して実行
    const onSuccessCallback = mockDeleteCard.mock.calls[0][1].onSuccess;
    onSuccessCallback();

    // その後に router.push が呼ばれることを確認
    expect(mockPush).toHaveBeenCalledWith('/cards');
  });
});
