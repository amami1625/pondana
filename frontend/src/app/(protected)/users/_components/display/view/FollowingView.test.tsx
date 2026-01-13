import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FollowingView from './FollowingView';
import { createMockUser } from '@/test/factories';

describe('FollowingView', () => {
  describe('レイアウト', () => {
    it('ページタイトル「フォロー中」が表示される', () => {
      render(<FollowingView id="1" userName="テストユーザー" following={[]} />);

      expect(screen.getByRole('heading', { name: 'フォロー中' })).toBeInTheDocument();
    });

    it('ユーザーのプロフィールページに戻るリンクが表示される', () => {
      render(<FollowingView id="1" userName="テストユーザー" following={[]} />);

      const backLink = screen.getByRole('link', { name: 'テストユーザーのプロフィールに戻る' });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/users/1');
    });
  });

  describe('リストのレンダリング', () => {
    it('フォロー中のユーザーが表示される', () => {
      const following = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'フォローユーザーA' }),
      ];

      render(<FollowingView id="1" userName="テストユーザー" following={following} />);

      expect(screen.getByText('フォローユーザーA')).toBeInTheDocument();
    });

    it('フォロー中のユーザーが複数存在する場合、全て表示される', () => {
      const following = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'フォローユーザーA' }),
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'フォローユーザーB' }),
      ];

      render(<FollowingView id="1" userName="テストユーザー" following={following} />);

      expect(screen.getByText('フォローユーザーA')).toBeInTheDocument();
      expect(screen.getByText('フォローユーザーB')).toBeInTheDocument();
    });
  });

  describe('フォロー中のユーザーが存在しない場合', () => {
    it('タイトルは表示される', () => {
      render(<FollowingView id="1" userName="テストユーザー" following={[]} />);

      expect(screen.getByRole('heading', { name: 'フォロー中' })).toBeInTheDocument();
    });

    it('空の状態メッセージが表示される', () => {
      render(<FollowingView id="1" userName="テストユーザー" following={[]} />);

      expect(screen.getByText('フォロー中のユーザーはいません')).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    it('空配列の lists が渡されてもエラーにならない', () => {
      expect(() =>
        render(<FollowingView id="1" userName="テストユーザー" following={[]} />),
      ).not.toThrow();
    });
  });
});
