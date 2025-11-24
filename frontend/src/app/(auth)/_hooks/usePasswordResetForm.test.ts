import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordResetForm } from './usePasswordResetForm';
import { updatePassword } from '@/app/(auth)/_lib/auth';
import toast from 'react-hot-toast';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock('@/app/(auth)/_lib/auth', () => ({
  updatePassword: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('usePasswordResetForm', () => {
  describe('初期状態', () => {
    it('isComplete が false で初期化される', () => {
      const { result } = renderHook(() => usePasswordResetForm());

      expect(result.current.isComplete).toBe(false);
    });

    it('isSubmitting が false で初期化される', () => {
      const { result } = renderHook(() => usePasswordResetForm());

      expect(result.current.isSubmitting).toBe(false);
    });

    it('router が返される', () => {
      const { result } = renderHook(() => usePasswordResetForm());

      expect(result.current.router).toBeDefined();
    });
  });

  describe('onSubmit', () => {
    it('成功時に isComplete が true になり、成功トーストが表示される', async () => {
      vi.mocked(updatePassword).mockResolvedValue({ success: true });
      const { result } = renderHook(() => usePasswordResetForm());

      await act(async () => {
        await result.current.onSubmit({
          password: 'newPassword123',
          confirmPassword: 'newPassword123',
        });
      });

      expect(result.current.isComplete).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('パスワードを変更しました');
    });

    it('エラー時に isComplete が false のまま、エラートーストが表示される', async () => {
      vi.mocked(updatePassword).mockResolvedValue({ error: 'パスワードの更新に失敗しました' });
      const { result } = renderHook(() => usePasswordResetForm());

      await act(async () => {
        await result.current.onSubmit({
          password: 'newPassword123',
          confirmPassword: 'newPassword123',
        });
      });

      expect(result.current.isComplete).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('パスワードの更新に失敗しました');
    });

    it('例外発生時にエラートーストが表示される', async () => {
      vi.mocked(updatePassword).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => usePasswordResetForm());

      await act(async () => {
        await result.current.onSubmit({
          password: 'newPassword123',
          confirmPassword: 'newPassword123',
        });
      });

      expect(result.current.isComplete).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('エラーが発生しました');
    });
  });
});
