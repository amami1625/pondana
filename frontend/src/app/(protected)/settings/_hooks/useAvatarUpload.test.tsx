import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockUser } from '@/test/factories';
import { mockUseProfileMutations } from '@/test/mocks';
import { useAvatarUpload } from './useAvatarUpload';
import toast from 'react-hot-toast';

// ミューテーションをモック
vi.mock('@/app/(protected)/settings/_hooks/useProfileMutations');

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useAvatarUpload', () => {
  const mockUser = createMockUser({
    name: 'テストユーザー',
    avatar_url: 'https://example.com/avatar.jpg',
  });

  const mockUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProfileMutations({ updateUser: mockUpdate });
  });

  describe('handleUploadSuccess', () => {
    it('アップロード成功時にプロフィールを更新する', async () => {
      const mockResult = {
        secure_url: 'https://cloudinary.com/new-avatar.jpg',
        public_id: 'avatars/test123',
      };

      const { result } = renderHook(() => useAvatarUpload({ user: mockUser }), {
        wrapper: createProvider(),
      });

      expect(result.current.isUploading).toBe(false);

      act(() => {
        result.current.handleUploadSuccess(mockResult);
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        name: mockUser.name,
        avatar_url: mockResult.secure_url,
        avatar_public_id: mockResult.public_id,
      });

      expect(result.current.isUploading).toBe(false);
    });
  });

  describe('handleUploadError', () => {
    it('アップロード失敗時にエラーメッセージを表示する', () => {
      const { result } = renderHook(() => useAvatarUpload({ user: mockUser }), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.setIsUploading(true);
      });

      expect(result.current.isUploading).toBe(true);

      act(() => {
        result.current.handleUploadError();
      });

      expect(result.current.isUploading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('画像のアップロードに失敗しました');
    });
  });

  describe('handleDelete', () => {
    it('削除時にavatar_urlをnullにしてプロフィールを更新する', async () => {
      const { result } = renderHook(() => useAvatarUpload({ user: mockUser }), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.handleDelete();
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        name: mockUser.name,
        avatar_url: null,
        avatar_public_id: null,
      });

      expect(result.current.isUploading).toBe(false);
    });
  });

  describe('isUploading', () => {
    it('アップロード中またはプロフィール更新中の場合trueになる', () => {
      const { result } = renderHook(() => useAvatarUpload({ user: mockUser }), {
        wrapper: createProvider(),
      });

      expect(result.current.isUploading).toBe(false);

      act(() => {
        result.current.setIsUploading(true);
      });

      expect(result.current.isUploading).toBe(true);
    });
  });
});
