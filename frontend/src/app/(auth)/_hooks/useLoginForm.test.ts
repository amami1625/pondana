import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginAction, loginClientSide } from '../_lib';
import { act, renderHook } from '@testing-library/react';
import { useLoginForm } from './useLoginForm';
import { LoginFormData } from '@/schemas/auth';
import toast from 'react-hot-toast';

// Next.js の useRouter をモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

// 認証関連の関数をモック
vi.mock('@/app/(auth)/_lib', () => ({
  loginAction: vi.fn(),
  loginClientSide: vi.fn(),
}));

// react-hot-toast をモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useLoginForm', () => {
  const mockLoginFormData: LoginFormData = {
    email: 'test@example.com',
    password: 'testpassword1234',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('onSubmit 関数が返される', () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.onSubmit).toBeDefined();
      expect(typeof result.current.onSubmit).toBe('function');
    });
  });

  describe('onSubmit: 正常系', () => {
    beforeEach(() => {
      vi.mocked(loginClientSide).mockResolvedValue(null);
      vi.mocked(loginAction).mockResolvedValue({ success: true });
    });

    it('loginClientside が呼ばれる', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(() => result.current.onSubmit(mockLoginFormData));

      expect(loginClientSide).toHaveBeenCalledWith(mockLoginFormData);
    });

    it('loginAction が呼ばれる', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(() => result.current.onSubmit(mockLoginFormData));

      expect(loginAction).toHaveBeenCalledWith(mockLoginFormData);
    });

    it('トーストが表示され、ログイン後トップページへ遷移する', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(() => result.current.onSubmit(mockLoginFormData));

      expect(toast.success).toHaveBeenCalledWith('ログインしました');
      expect(mockPush).toHaveBeenCalledWith('/top');
    });
  });

  describe('onSubmit: 異常系', () => {
    it('loginClientSide のエラーメッセージがトーストで表示される', async () => {
      vi.mocked(loginClientSide).mockResolvedValue('エラーです');

      const { result } = renderHook(() => useLoginForm());

      await act(() => result.current.onSubmit(mockLoginFormData));

      expect(toast.error).toHaveBeenCalledWith('エラーです');
    });

    it('loginAction のエラーメッセージがトーストで表示される', async () => {
      vi.mocked(loginClientSide).mockResolvedValue(null);
      vi.mocked(loginAction).mockResolvedValue({ error: 'エラーです' });

      const { result } = renderHook(() => useLoginForm());

      await act(() => result.current.onSubmit(mockLoginFormData));

      expect(toast.error).toHaveBeenCalledWith('エラーです');
    });

    it('トップページに遷移されない', async () => {
      vi.mocked(loginClientSide).mockResolvedValue(null);
      vi.mocked(loginAction).mockResolvedValue({ error: 'エラーです' });

      const { result } = renderHook(() => useLoginForm());

      await act(() => result.current.onSubmit(mockLoginFormData));

      expect(toast.success).not.toHaveBeenCalledWith('ログインしました');
      expect(mockPush).not.toHaveBeenCalledWith('/top');
    });
  });
});
