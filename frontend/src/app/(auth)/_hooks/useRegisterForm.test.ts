import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { signUpAction } from '../_lib';
import { RegisterFormData } from '@/schemas/auth';
import { useRegisterForm } from './useRegisterForm';
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
  signUpAction: vi.fn(),
}));

// react-hot-toast をモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useRegisterForm', () => {
  const mockRegisterFormData: RegisterFormData = {
    name: 'test-user',
    email: 'test@example.com',
    password: 'testpassword1234',
    passwordConfirmation: 'testpassword1234',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('onSubmit 関数が返される', () => {
      const { result } = renderHook(() => useRegisterForm());

      expect(result.current.onSubmit).toBeDefined();
      expect(typeof result.current.onSubmit).toBe('function');
    });
  });

  describe('onSubmit: 正常系', () => {
    beforeEach(() => {
      vi.mocked(signUpAction).mockResolvedValue(null);
    });

    it('signUpAction が呼ばれる', async () => {
      const { result } = renderHook(() => useRegisterForm());

      await act(() => result.current.onSubmit(mockRegisterFormData));

      expect(signUpAction).toHaveBeenCalledWith(
        mockRegisterFormData.name,
        mockRegisterFormData.email,
        mockRegisterFormData.password,
      );
    });

    it('トーストが表示され、トップページへ遷移する', async () => {
      const { result } = renderHook(() => useRegisterForm());

      await act(() => result.current.onSubmit(mockRegisterFormData));

      expect(toast.success).toHaveBeenCalledWith('ユーザー登録が完了しました');
      expect(mockPush).toHaveBeenCalledWith('/top');
    });
  });

  describe('onSubmit: 異常系', () => {
    beforeEach(() => {
      vi.mocked(signUpAction).mockResolvedValue('エラーです');
    });

    it('signUpAction のエラーメッセージがトーストで表示される', async () => {
      const { result } = renderHook(() => useRegisterForm());

      await act(() => result.current.onSubmit(mockRegisterFormData));

      expect(toast.error).toHaveBeenCalledWith('エラーです');
    });

    it('トップページへ遷移されない', async () => {
      const { result } = renderHook(() => useRegisterForm());

      await act(() => result.current.onSubmit(mockRegisterFormData));

      expect(toast.success).not.toHaveBeenCalledWith('ユーザー登録が完了しました');
      expect(mockPush).not.toHaveBeenCalledWith('/top');
    });
  });
});
