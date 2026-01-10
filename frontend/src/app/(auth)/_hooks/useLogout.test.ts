import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogout } from './useLogout';
import { logoutAction, logoutClientSide } from '@/app/(auth)/_lib';
import toast from 'react-hot-toast';

// Next.jsのuseRouterをモック
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

// React QueryのuseQueryClientをモック
const mockClear = vi.fn();
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(() => ({
    clear: mockClear,
  })),
}));

// 認証関連の関数をモック
vi.mock('@/app/(auth)/_lib', () => ({
  logoutAction: vi.fn(),
  logoutClientSide: vi.fn(),
}));

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('loading が false で初期化される', () => {
      const { result } = renderHook(() => useLogout());

      expect(result.current.loading).toBe(false);
    });

    it('logout 関数が返される', () => {
      const { result } = renderHook(() => useLogout());

      expect(result.current.logout).toBeDefined();
      expect(typeof result.current.logout).toBe('function');
    });
  });

  describe('logout: 正常系', () => {
    beforeEach(() => {
      vi.mocked(logoutClientSide).mockResolvedValue(null);
      vi.mocked(logoutAction).mockResolvedValue({ success: true });
    });

    it('logoutClientSide が呼ばれる', async () => {
      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(logoutClientSide).toHaveBeenCalled();
    });

    it('logoutAction が呼ばれる', async () => {
      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(logoutAction).toHaveBeenCalled();
    });

    it('queryClient.clear (キャッシュクリア) が呼ばれる', async () => {
      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(mockClear).toHaveBeenCalled();
    });

    it('トーストが表示され、トップページへ遷移する', async () => {
      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(toast.success).toHaveBeenCalledWith('ログアウトしました');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('logout: 異常系', () => {
    it('logoutClientSide のエラーメッセージがトーストで表示される', async () => {
      vi.mocked(logoutClientSide).mockResolvedValue('エラーです');

      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(toast.error).toHaveBeenCalledWith('エラーです');
      expect(result.current.loading).toBe(false);
    });

    it('logoutAction のエラーメッセージがトーストで表示される', async () => {
      vi.mocked(logoutClientSide).mockResolvedValue(null);
      vi.mocked(logoutAction).mockResolvedValue({ error: 'エラーです' });

      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(toast.error).toHaveBeenCalledWith('エラーです');
      expect(result.current.loading).toBe(false);
    });

    it('queryClient.clear (キャッシュクリア)が呼ばれない', async () => {
      vi.mocked(logoutClientSide).mockResolvedValue(null);
      vi.mocked(logoutAction).mockResolvedValue({ error: 'エラーです' });

      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(mockClear).not.toHaveBeenCalled();
    });

    it('トップページに遷移されない', async () => {
      vi.mocked(logoutClientSide).mockResolvedValue(null);
      vi.mocked(logoutAction).mockResolvedValue({ error: 'エラーです' });

      const { result } = renderHook(() => useLogout());

      await act(() => result.current.logout());

      expect(toast.success).not.toHaveBeenCalledWith('ログアウトしました');
      expect(mockPush).not.toHaveBeenCalledWith('/');
    });
  });
});
