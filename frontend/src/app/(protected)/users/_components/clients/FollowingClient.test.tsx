import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUser, useFollowing } from '@/app/(protected)/users/_hooks';
import FollowingClient from './FollowingClient';
import { createMockUser, createMockUserWithStats } from '@/test/factories';

vi.mock('@/app/(protected)/users/_hooks', () => ({
  useUser: vi.fn(),
  useFollowing: vi.fn(),
}));

describe('FollowingClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ローディング状態', () => {
    it('ユーザー情報の読み込み中の表示がされる', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByText('フォロー中のユーザーを読み込んでいます...')).toBeInTheDocument();
    });

    it('フォロー中ユーザーの読み込み中の表示がされる', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
        isError: false,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByText('フォロー中のユーザーを読み込んでいます...')).toBeInTheDocument();
    });
  });

  describe('エラー状態', () => {
    it('ユーザー情報のエラー時にメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: new Error('ユーザー情報の取得に失敗しました'),
        isLoading: false,
        isError: true,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByText('ユーザー情報の取得に失敗しました')).toBeInTheDocument();
    });

    it('フォロー中ユーザーのエラー時にメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: createMockUserWithStats({ id: 1, name: 'テストユーザー' }),
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: undefined,
        error: new Error('ネットワークエラーが発生しました'),
        isLoading: false,
        isError: true,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument();
    });

    it('データが取得できない場合にエラーメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument();
    });
  });

  describe('正常表示', () => {
    it('フォロー中のユーザーが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: createMockUserWithStats({ id: 1, name: 'テストユーザー' }),
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: [
          createMockUser({ id: 2, name: 'フォロー中ユーザーA' }),
          createMockUser({ id: 3, name: 'フォロー中ユーザーB' }),
        ],
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByRole('heading', { name: 'フォロー中' })).toBeInTheDocument();
      expect(screen.getByText('フォロー中ユーザーA')).toBeInTheDocument();
      expect(screen.getByText('フォロー中ユーザーB')).toBeInTheDocument();
    });

    it('フォロー中のユーザーが0人の場合、空の状態メッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: createMockUserWithStats({ id: 1, name: 'テストユーザー' }),
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowing).mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowing>);

      render(<FollowingClient id="1" />);

      expect(screen.getByRole('heading', { name: 'フォロー中' })).toBeInTheDocument();
      expect(screen.getByText('フォロー中のユーザーはいません')).toBeInTheDocument();
    });
  });
});
