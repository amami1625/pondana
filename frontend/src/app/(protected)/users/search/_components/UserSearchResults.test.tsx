import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserSearchResults from './UserSearchResults';
import { createMockUser } from '@/test/factories';
import { createProvider } from '@/test/helpers';
import { useProfile } from '@/hooks/useProfile';

// useProfileをモック化
vi.mock('@/hooks/useProfile');

describe('UserSearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトでuseProfileがnullを返すようにモック
    vi.mocked(useProfile).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useProfile>);
  });

  describe('表示条件分岐', () => {
    it('query が 0 文字の場合、何も表示されない', () => {
      const { container } = render(
        <UserSearchResults query="" suggestions={[]} isLoading={false} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('query が 2 文字以上で isLoading が true の場合、「検索中...」と表示される', () => {
      render(<UserSearchResults query="test" suggestions={[]} isLoading={true} />);

      expect(screen.getByText('検索中...')).toBeInTheDocument();
    });

    it('query が 2 文字以上で検索結果がない場合、「一致するユーザーが見つかりませんでした」と表示される', () => {
      render(<UserSearchResults query="test" suggestions={[]} isLoading={false} />);

      expect(screen.getByText(/一致するユーザーが見つかりませんでした/)).toBeInTheDocument();
      expect(screen.getByText(/test/)).toBeInTheDocument();
    });
  });

  describe('検索結果の表示', () => {
    const mockUsers = [
      createMockUser({ id: '550e8400-e29b-41d4-a716-446655440000', name: 'ユーザーA' }),
      createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'ユーザーB' }),
      createMockUser({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'ユーザーC' }),
    ];

    it('検索結果がある場合、件数が表示される', () => {
      render(<UserSearchResults query="user" suggestions={mockUsers} isLoading={false} />, {
        wrapper: createProvider(),
      });

      expect(screen.getByText('3件のユーザーが見つかりました')).toBeInTheDocument();
    });

    it('検索結果がある場合、すべてのユーザー名が表示される', () => {
      render(<UserSearchResults query="user" suggestions={mockUsers} isLoading={false} />, {
        wrapper: createProvider(),
      });

      expect(screen.getByText('ユーザーA')).toBeInTheDocument();
      expect(screen.getByText('ユーザーB')).toBeInTheDocument();
      expect(screen.getByText('ユーザーC')).toBeInTheDocument();
    });

    it('各ユーザーカードに正しいリンクが設定されている', () => {
      render(<UserSearchResults query="user" suggestions={mockUsers} isLoading={false} />, {
        wrapper: createProvider(),
      });

      const links = screen.getAllByRole('link');
      // 各ユーザーカードには2つのリンク（アバターと名前）がある
      const userLinks = links.filter((link) => link.getAttribute('href')?.startsWith('/users/'));
      expect(userLinks.length).toBe(3);
      expect(userLinks[0]).toHaveAttribute('href', '/users/550e8400-e29b-41d4-a716-446655440000');
      expect(userLinks[1]).toHaveAttribute('href', '/users/550e8400-e29b-41d4-a716-446655440001');
      expect(userLinks[2]).toHaveAttribute('href', '/users/550e8400-e29b-41d4-a716-446655440002');
    });

    it('各ユーザーカードにアバター（頭文字）が表示される', () => {
      render(<UserSearchResults query="user" suggestions={mockUsers} isLoading={false} />, {
        wrapper: createProvider(),
      });

      expect(screen.getAllByTestId('initial')).toHaveLength(3);
      expect(screen.getAllByTestId('initial')[0]).toHaveTextContent('ユ');
    });

    it('名前の頭文字が小文字でも大文字で表示される', () => {
      const lowerCaseUsers = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440000', name: 'alice' }),
      ];
      render(<UserSearchResults query="alice" suggestions={lowerCaseUsers} isLoading={false} />, {
        wrapper: createProvider(),
      });

      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('検索結果が1件の場合、「1件のユーザーが見つかりました」と表示される', () => {
      const singleUser = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440000', name: 'ユーザー' }),
      ];
      render(<UserSearchResults query="single" suggestions={singleUser} isLoading={false} />, {
        wrapper: createProvider(),
      });

      expect(screen.getByText('1件のユーザーが見つかりました')).toBeInTheDocument();
    });

    it('query にトリムが必要なスペースがある場合でも正しく動作する', () => {
      render(<UserSearchResults query="  test  " suggestions={[]} isLoading={false} />);

      expect(screen.getByText(/一致するユーザーが見つかりませんでした/)).toBeInTheDocument();
    });
  });
});
