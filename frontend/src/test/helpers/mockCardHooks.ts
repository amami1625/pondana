import { vi } from 'vitest';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';

/**
 * useCardMutations のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseCardMutations = (overrides = {}) => {
  vi.mocked(useCardMutations).mockReturnValue({
    createCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: null,
    updateError: null,
    deleteError: null,
    ...overrides,
  });
};
