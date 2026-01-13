import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUser, useFollowers } from '@/app/(protected)/users/_hooks';
import FollowersClient from './FollowersClient';
import { createMockUser, createMockUserWithStats } from '@/test/factories';

vi.mock('@/app/(protected)/users/_hooks', () => ({
  useUser: vi.fn(),
  useFollowers: vi.fn(),
}));

describe('FollowersClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ローディング状態', () => {
    it('読み込み中のメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowers).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowers>);

      render(<FollowersClient id="1" />);

      expect(screen.getByText('フォロワーを読み込んでいます...')).toBeInTheDocument();
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
      vi.mocked(useFollowers).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowers>);

      render(<FollowersClient id="1" />);

      expect(screen.getByText('ユーザー情報の取得に失敗しました')).toBeInTheDocument();
    });

    it('フォロワーのエラー時にメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: createMockUserWithStats({
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'テストユーザー',
        }),
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowers).mockReturnValue({
        data: undefined,
        error: new Error('ネットワークエラーが発生しました'),
        isLoading: false,
        isError: true,
      } as unknown as ReturnType<typeof useFollowers>);

      render(<FollowersClient id="1" />);

      expect(screen.getByText('ネットワークエラーが発生しました')).toBeInTheDocument();
    });

    it('データが取得できなかった場合にエラーメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowers).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowers>);

      render(<FollowersClient id="1" />);

      expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument();
    });
  });

  describe('正常表示', () => {
    it('フォロワー一覧が表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: createMockUserWithStats({
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'テストユーザー',
        }),
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useFollowers).mockReturnValue({
        data: [
          createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'フォロワーA' }),
          createMockUser({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'フォロワーB' }),
        ],
        error: null,
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useFollowers>);

      render(<FollowersClient id="1" />);

      expect(screen.getByRole('heading', { name: 'フォロワー' })).toBeInTheDocument();
    });
  });
});
