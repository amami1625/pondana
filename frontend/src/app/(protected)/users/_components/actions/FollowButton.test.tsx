import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FollowButton from './FollowButton';
import { useFollowMutations } from '@/app/(protected)/users/_hooks/useFollowMutations';
import { useFollowStatus } from '@/app/(protected)/users/_hooks/useFollowStatus';
import { useProfile } from '@/hooks/useProfile';

vi.mock('@/app/(protected)/users/_hooks/useFollowMutations');
vi.mock('@/app/(protected)/users/_hooks/useFollowStatus');
vi.mock('@/hooks/useProfile');

describe('FollowButton', () => {
  const mockFollow = vi.fn();
  const mockUnfollow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ボタンの表示', () => {
    it('フォローしていない場合、「フォロー」ボタンが表示される', () => {
      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: { is_following: false, is_followed_by: false },
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'フォロー' });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('フォロー中の場合、「フォロー中」ボタンが表示される', () => {
      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: { is_following: true, is_followed_by: false },
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'フォロー中' });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  describe('ボタンのクリック', () => {
    it('フォローしていない場合、クリックするとフォロー処理が実行される', async () => {
      const user = userEvent.setup();

      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: { is_following: false, is_followed_by: false },
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'フォロー' });
      await user.click(button);

      expect(mockFollow).toHaveBeenCalledTimes(1);
      expect(mockUnfollow).not.toHaveBeenCalled();
    });

    it('フォロー中の場合、クリックするとフォロー解除処理が実行される', async () => {
      const user = userEvent.setup();

      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: { is_following: true, is_followed_by: false },
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'フォロー中' });
      await user.click(button);

      expect(mockUnfollow).toHaveBeenCalledTimes(1);
      expect(mockFollow).not.toHaveBeenCalled();
    });
  });

  describe('ローディング状態', () => {
    it('フォロー状態の読み込み中はボタンが無効化される', () => {
      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'フォロー' });
      expect(button).toBeDisabled();
    });

    it('フォロー/フォロー解除処理中はボタンが無効化される', () => {
      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: { is_following: false, is_followed_by: false },
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: true,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'フォロー' });
      expect(button).toBeDisabled();
    });
  });

  describe('エラー状態', () => {
    it('フォロー状態の取得エラー時にエラーメッセージが表示される', () => {
      vi.mocked(useProfile).mockReturnValue({
        data: { id: 999, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('ネットワークエラーが発生しました'),
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      const button = screen.getByRole('button', { name: 'ネットワークエラーが発生しました' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  describe('自分自身のプロフィール', () => {
    it('自分自身のプロフィールの場合、ボタンが表示されない', () => {
      vi.mocked(useProfile).mockReturnValue({
        data: { id: 1, name: 'Current User', email: 'current@example.com' },
      } as unknown as ReturnType<typeof useProfile>);
      vi.mocked(useFollowStatus).mockReturnValue({
        data: { is_following: false, is_followed_by: false },
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useFollowStatus>);
      vi.mocked(useFollowMutations).mockReturnValue({
        follow: mockFollow,
        unfollow: mockUnfollow,
        isFollowing: false,
        isUnfollowing: false,
        isLoading: false,
      });

      render(<FollowButton userId="1" />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
