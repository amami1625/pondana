import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordChange } from './usePasswordChange';
import { verifyAndSendPasswordResetEmail } from '@/app/(auth)/_lib/auth';
import toast from 'react-hot-toast';

vi.mock('@/app/(auth)/_lib/auth', () => ({
  verifyAndSendPasswordResetEmail: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('usePasswordChange', () => {
  describe('初期状態', () => {
    it('isSent が false で初期化される', () => {
      const { result } = renderHook(() => usePasswordChange());

      expect(result.current.isSent).toBe(false);
    });

    it('isSubmitting が false で初期化される', () => {
      const { result } = renderHook(() => usePasswordChange());

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('成功時に isSent が true になり、成功トーストが表示される', async () => {
      vi.mocked(verifyAndSendPasswordResetEmail).mockResolvedValue({ success: true });
      const { result } = renderHook(() => usePasswordChange());

      await act(async () => {
        await result.current.onSubmit({ password: 'correctPassword' });
      });

      expect(result.current.isSent).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('パスワード変更用のメールを送信しました');
    });

    it('エラー時に isSent が false のまま、エラートーストが表示される', async () => {
      vi.mocked(verifyAndSendPasswordResetEmail).mockResolvedValue({
        error: 'パスワードが正しくありません',
      });
      const { result } = renderHook(() => usePasswordChange());

      await act(async () => {
        await result.current.onSubmit({ password: 'wrongPassword' });
      });

      expect(result.current.isSent).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('パスワードが正しくありません');
    });

    it('例外発生時にエラートーストが表示される', async () => {
      vi.mocked(verifyAndSendPasswordResetEmail).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => usePasswordChange());

      await act(async () => {
        await result.current.onSubmit({ password: 'password' });
      });

      expect(result.current.isSent).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('エラーが発生しました');
    });
  });
});
