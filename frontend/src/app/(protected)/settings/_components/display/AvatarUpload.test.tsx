import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockUser } from '@/test/factories';
import AvatarUpload from './AvatarUpload';

// next-cloudinaryをモック
vi.mock('next-cloudinary', () => ({
  CldUploadWidget: ({ children }: { children: (props: { open: () => void }) => React.ReactNode }) =>
    children({ open: vi.fn() }),
}));

// 環境変数をモック
beforeEach(() => {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud';
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test-preset';
});

describe('AvatarUpload', () => {
  describe('環境変数が設定されている場合', () => {
    it('アバター画像がない場合、アイコンとアップロードボタンが表示される', () => {
      const user = createMockUser({ avatar_url: null });

      render(<AvatarUpload user={user} />, { wrapper: createProvider() });

      // アップロードボタンが表示される
      expect(screen.getByRole('button', { name: /画像をアップロード/i })).toBeInTheDocument();
      // 削除ボタンは表示されない
      expect(screen.queryByRole('button', { name: /削除/i })).not.toBeInTheDocument();
    });

    it('アバター画像がある場合、画像と変更・削除ボタンが表示される', () => {
      const user = createMockUser({ avatar_url: 'https://example.com/avatar.jpg' });

      render(<AvatarUpload user={user} />, { wrapper: createProvider() });

      // 変更ボタンが表示される
      expect(screen.getByRole('button', { name: /画像を変更/i })).toBeInTheDocument();
      // 削除ボタンが表示される
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument();
    });
  });

  describe('環境変数が設定されていない場合', () => {
    it('何も表示されない', () => {
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = '';
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = '';

      const user = createMockUser({ avatar_url: null });

      const { container } = render(<AvatarUpload user={user} />, { wrapper: createProvider() });

      expect(container.firstChild).toBeNull();
    });
  });
});
