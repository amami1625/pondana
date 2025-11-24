import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmailChange } from './useEmailChange';
import { sendEmailChangeConfirmation } from '@/app/(auth)/_lib/auth';
import { logoutAction } from '@/app/(auth)/_lib/session';
import toast from 'react-hot-toast';

vi.mock('@/app/(auth)/_lib/auth', () => ({
  sendEmailChangeConfirmation: vi.fn(),
}));

vi.mock('@/app/(auth)/_lib/session', () => ({
  logoutAction: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useEmailChange', () => {
  describe('初期状態', () => {
    it('isSent が false で初期化される', () => {
      const { result } = renderHook(() => useEmailChange());

      expect(result.current.isSent).toBe(false);
    });

    it('newEmail が空文字で初期化される', () => {
      const { result } = renderHook(() => useEmailChange());

      expect(result.current.newEmail).toBe('');
    });

    it('isSubmitting が false で初期化される', () => {
      const { result } = renderHook(() => useEmailChange());

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('成功時に isSent が true になり、newEmail が設定される', async () => {
      vi.mocked(sendEmailChangeConfirmation).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useEmailChange());

      await act(async () => {
        await result.current.onSubmit({ email: 'new@example.com' });
      });

      expect(result.current.isSent).toBe(true);
      expect(result.current.newEmail).toBe('new@example.com');
      expect(toast.success).toHaveBeenCalledWith('確認メールを送信しました');
    });

    it('成功時に5秒後にログアウトが呼ばれる', async () => {
      vi.useFakeTimers();
      vi.mocked(sendEmailChangeConfirmation).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useEmailChange());

      await act(async () => {
        await result.current.onSubmit({ email: 'new@example.com' });
      });

      expect(logoutAction).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(logoutAction).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('エラー時に isSent が false のまま、エラートーストが表示される', async () => {
      vi.mocked(sendEmailChangeConfirmation).mockResolvedValue({ error: 'Email already in use' });
      const { result } = renderHook(() => useEmailChange());

      await act(async () => {
        await result.current.onSubmit({ email: 'existing@example.com' });
      });

      expect(result.current.isSent).toBe(false);
      expect(result.current.newEmail).toBe('');
      expect(toast.error).toHaveBeenCalledWith('Email already in use');
    });

    it('例外発生時にエラートーストが表示される', async () => {
      vi.mocked(sendEmailChangeConfirmation).mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useEmailChange());

      await act(async () => {
        await result.current.onSubmit({ email: 'new@example.com' });
      });

      expect(result.current.isSent).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('エラーが発生しました');
    });
  });
});
