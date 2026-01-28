import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { signInWithGoogle } from '@/app/(auth)/_lib/oauth';
import { useGoogleLoginButton } from './useGoogleLoginButton';

vi.mock('@/app/(auth)/_lib/oauth');
vi.mock('react-hot-toast');

describe('useGoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('isLoading が false', () => {
      const { result } = renderHook(() => useGoogleLoginButton());
  
      expect(result.current.isLoading).toBe(false);
    });
  })

  describe('handleGoogleLogin', () => {
    it('実行時に signInWithGoogle が呼ばれる', async () => {
      vi.mocked(signInWithGoogle).mockResolvedValue(null);
  
      const { result } = renderHook(() => useGoogleLoginButton());
  
      await act(async () => {
        await result.current.handleGoogleLogin();
      });
  
      expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  
    it('エラー時にトーストが表示され isLoading が false になる', async () => {
      vi.mocked(signInWithGoogle).mockResolvedValue('OAuth error');
  
      const { result } = renderHook(() => useGoogleLoginButton());
  
      await act(async () => {
        await result.current.handleGoogleLogin();
      });
  
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Googleログインに失敗しました');
        expect(result.current.isLoading).toBe(false);
      });
    });
  
    it('成功時にトーストが表示される', async () => {
      vi.mocked(signInWithGoogle).mockResolvedValue(null);
  
      const { result } = renderHook(() => useGoogleLoginButton());
  
      await act(async () => {
        await result.current.handleGoogleLogin();
      });
  
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('ログインしました');
      });
    });

  })

});
