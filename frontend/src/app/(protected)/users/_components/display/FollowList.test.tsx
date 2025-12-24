import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FollowList from './FollowList';
import { createMockUser } from '@/test/factories';

describe('FollowList', () => {
  describe('リンク', () => {
    it('ユーザープロフィールへのリンクが表示される', () => {
      const user = createMockUser({ id: 1, name: 'テストユーザー' });

      render(<FollowList user={user} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/users/1');
    });
  });

  describe('プロフィール画像', () => {
    it('アバター画像がある場合、画像が表示される', () => {
      const user = createMockUser({
        id: 1,
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
        id: 1,
        name: 'テストユーザー',
        avatar_url: null,
      });

      render(<FollowList user={user} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('テ')).toBeInTheDocument();
    });

    it('名前の頭文字が大文字で表示される', () => {
      const user = createMockUser({
        id: 1,
        name: 'test user',
        avatar_url: null,
      });

      render(<FollowList user={user} />);

      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('ユーザー名', () => {
    it('ユーザー名が表示される', () => {
      const user = createMockUser({ id: 1, name: 'テストユーザー' });

      render(<FollowList user={user} />);

      expect(screen.getByRole('heading', { name: 'テストユーザー' })).toBeInTheDocument();
    });

    it('複数のユーザー名が正しく表示される', () => {
      const user1 = createMockUser({ id: 1, name: 'ユーザーA' });
      const user2 = createMockUser({ id: 2, name: 'ユーザーB' });

      const { rerender } = render(<FollowList user={user1} />);
      expect(screen.getByRole('heading', { name: 'ユーザーA' })).toBeInTheDocument();

      rerender(<FollowList user={user2} />);
      expect(screen.getByRole('heading', { name: 'ユーザーB' })).toBeInTheDocument();
    });
  });
});
