import { vi } from 'vitest';
import { useModal } from '@/hooks/useModal';

/**
 * useModal のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseModal = (overrides = {}) => {
  vi.mocked(useModal).mockReturnValue({
    isOpen: false,
    open: vi.fn(),
    close: vi.fn(),
    ...overrides,
  });
};
