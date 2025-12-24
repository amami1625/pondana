import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUser, useUserBooks, useUserLists } from '@/app/(protected)/users/_hooks';
import UserDetailClient from './UserDetailClient';
import { createMockBook, createMockList, createMockUserWithStats } from '@/test/factories';
import { createProvider } from '@/test/helpers';
import { useProfile } from '@/hooks/useProfile';

// useProfileをモック化
vi.mock('@/hooks/useProfile');

vi.mock('@/app/(protected)/users/_hooks', () => ({
  useUser: vi.fn(),
  useUserBooks: vi.fn(),
  useUserLists: vi.fn(),
}));

describe('UserDetailClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトでuseProfileがnullを返すようにモック
    vi.mocked(useProfile).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useProfile>);
  });

  describe('ユーザープロフィール', () => {
    it('読み込み中の表示がされる', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('ユーザー情報を読み込んでいます...')).toBeInTheDocument();
    });

    it('エラー時にメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: new Error('エラーのテスト'),
        isLoading: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('エラーのテスト')).toBeInTheDocument();
    });

    it('エラーメッセージが設定されていない場合、デフォルトのエラーメッセージが表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: undefined,
        error: new Error(),
        isLoading: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });

    it('ユーザー名が表示される', () => {
      vi.mocked(useUser).mockReturnValue({
        data: createMockUserWithStats({ name: 'テストユーザー' }),
        error: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />, { wrapper: createProvider() });

      expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    });
  });

  describe('本の表示', () => {
    it('読み込み中の表示がされる', () => {
      vi.mocked(useUserBooks).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('本を読み込んでいます...')).toBeInTheDocument();
    });

    it('エラー時にメッセージが表示される', () => {
      vi.mocked(useUserBooks).mockReturnValue({
        data: undefined,
        error: new Error('エラーのテスト'),
        isLoading: false,
      } as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('エラーのテスト')).toBeInTheDocument();
    });

    it('エラーメッセージが設定されていない場合、デフォルトのエラーメッセージが表示される', () => {
      vi.mocked(useUserBooks).mockReturnValue({
        data: undefined,
        error: new Error(),
        isLoading: false,
      } as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('本の取得に失敗しました')).toBeInTheDocument();
    });

    it('本一覧が表示される', () => {
      vi.mocked(useUserBooks).mockReturnValue({
        data: [createMockBook({ title: 'テスト本A' })],
        error: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useUserBooks>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserLists).mockReturnValue({} as unknown as ReturnType<typeof useUserLists>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('本一覧')).toBeInTheDocument();
    });
  });

  describe('リストの表示', () => {
    it('読み込み中の表示がされる', () => {
      vi.mocked(useUserLists).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as unknown as ReturnType<typeof useUserLists>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('リストを読み込んでいます...')).toBeInTheDocument();
    });

    it('エラー時にメッセージが表示される', () => {
      vi.mocked(useUserLists).mockReturnValue({
        data: undefined,
        error: new Error('エラーのテスト'),
        isLoading: false,
      } as unknown as ReturnType<typeof useUserLists>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('エラーのテスト')).toBeInTheDocument();
    });

    it('エラーメッセージが設定されていない場合、デフォルトのエラーメッセージが表示される', () => {
      vi.mocked(useUserLists).mockReturnValue({
        data: undefined,
        error: new Error(),
        isLoading: false,
      } as unknown as ReturnType<typeof useUserLists>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('リストの取得に失敗しました')).toBeInTheDocument();
    });

    it('公開リストが表示される', () => {
      vi.mocked(useUserLists).mockReturnValue({
        data: [createMockList({ name: 'テストリスト' })],
        error: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useUserLists>);
      vi.mocked(useUser).mockReturnValue({} as unknown as ReturnType<typeof useUser>);
      vi.mocked(useUserBooks).mockReturnValue({} as unknown as ReturnType<typeof useUserBooks>);

      render(<UserDetailClient id="1" />);

      expect(screen.getByText('公開リスト')).toBeInTheDocument();
    });
  });
});
