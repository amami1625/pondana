import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FollowersView from './FollowersView';
import { createMockUser } from '@/test/factories';

describe('FollowersView', () => {
  describe('レイアウト', () => {
    it('ページタイトル「フォロワー」が表示される', () => {
      render(<FollowersView id="1" userName="テストユーザー" followers={[]} />);

      expect(screen.getByRole('heading', { name: 'フォロワー' })).toBeInTheDocument();
    });

    it('ユーザーのプロフィールページに戻るリンクが表示される', () => {
      render(<FollowersView id="1" userName="テストユーザー" followers={[]} />);

      const backLink = screen.getByRole('link', { name: 'テストユーザーのプロフィールに戻る' });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/users/1');
    });
  });

  describe('リストのレンダリング', () => {
    it('フォロワーが表示される', () => {
      const followers = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'フォロワーA' }),
      ];

      render(<FollowersView id="1" userName="テストユーザー" followers={followers} />);

      expect(screen.getByText('フォロワーA')).toBeInTheDocument();
    });

    it('フォロワーが複数存在する場合、全て表示される', () => {
      const followers = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'フォロワーA' }),
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'フォロワーB' }),
      ];

      render(<FollowersView id="1" userName="テストユーザー" followers={followers} />);

      expect(screen.getByText('フォロワーA')).toBeInTheDocument();
      expect(screen.getByText('フォロワーB')).toBeInTheDocument();
    });
  });

  describe('フォロワーが存在しない場合', () => {
    it('タイトルは表示される', () => {
      render(<FollowersView id="1" userName="テストユーザー" followers={[]} />);

      expect(screen.getByRole('heading', { name: 'フォロワー' })).toBeInTheDocument();
    });

    it('空の状態メッセージが表示される', () => {
      render(<FollowersView id="1" userName="テストユーザー" followers={[]} />);

      expect(screen.getByText('フォロワーはいません')).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    it('空配列の followers が渡されてもエラーにならない', () => {
      expect(() =>
        render(<FollowersView id="1" userName="テストユーザー" followers={[]} />),
      ).not.toThrow();
    });
  });
});
