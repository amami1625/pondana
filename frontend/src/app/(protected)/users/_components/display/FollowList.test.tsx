import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FollowList from './FollowList';
import { createMockUser } from '@/test/factories';

describe('FollowList', () => {
  describe('リンク', () => {
    it('ユーザープロフィールへのリンクが表示される', () => {
      const user = createMockUser({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'テストユーザー',
      });

      render(<FollowList user={user} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/users/550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('プロフィール画像', () => {
    it('アバター画像がある場合、画像が表示される', () => {
      const user = createMockUser({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'テストユーザー',
        avatar_url: 'https://example.com/avatar.jpg',
      });

      render(<FollowList user={user} />);

      const image = screen.getByRole('img', { name: 'テストユーザー' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('avatar.jpg'));
    });

    it('アバター画像がない場合、名前の頭文字が表示される', () => {
      const user = createMockUser({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'テストユーザー',
        avatar_url: null,
      });

      render(<FollowList user={user} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('テ')).toBeInTheDocument();
    });

    it('名前の頭文字が大文字で表示される', () => {
      const user = createMockUser({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'test user',
        avatar_url: null,
      });

      render(<FollowList user={user} />);

      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('ユーザー名', () => {
    it('ユーザー名が表示される', () => {
      const user = createMockUser({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'テストユーザー',
      });

      render(<FollowList user={user} />);

      expect(screen.getByRole('heading', { name: 'テストユーザー' })).toBeInTheDocument();
    });
  });
});
