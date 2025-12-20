import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createMockUserWithStats } from '@/test/factories';
import UserProfileView from './UserProfileView';

describe('UserProfileView', () => {
  describe('レイアウト', () => {
    it('ユーザー名が表示されている', () => {
      const user = createMockUserWithStats({ name: 'テストユーザー' });

      render(<UserProfileView user={user} />);

      expect(screen.getByRole('heading', { name: 'テストユーザー' })).toBeInTheDocument();
    });
  });

  describe('統計情報の表示', () => {
    it('公開している本の数が表示される', () => {
      const user = createMockUserWithStats({
        name: 'テストユーザー',
        stats: { public_books: 5, public_lists: 2 },
      });

      render(<UserProfileView user={user} />);

      expect(screen.getByText('公開している本')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('公開しているリストの数が表示される', () => {
      const user = createMockUserWithStats({
        name: 'テストユーザー',
        stats: { public_books: 5, public_lists: 2 },
      });

      render(<UserProfileView user={user} />);

      expect(screen.getByText('公開しているリスト')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('公開している本が無い場合、0 と表示される', () => {
      const user = createMockUserWithStats({
        name: 'テストユーザー',
        stats: { public_books: 0, public_lists: 2 },
      });

      render(<UserProfileView user={user} />);

      expect(screen.getByText('公開している本')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('公開しているリストが無い場合、0 と表示される', () => {
      const user = createMockUserWithStats({
        name: 'テストユーザー',
        stats: { public_books: 5, public_lists: 0 },
      });

      render(<UserProfileView user={user} />);

      expect(screen.getByText('公開しているリスト')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('プロフィール画像の表示', () => {
    it('プロフィール画像が存在する場合、画像が表示される', () => {
      const user = createMockUserWithStats({
        name: 'テストユーザー',
        avatar_url: 'http://testImage.com',
      });

      render(<UserProfileView user={user} />);

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('プロフィール画像が無い場合、ユーザー名の頭文字が表示される', () => {
      const user = createMockUserWithStats({ name: 'テストユーザー' });

      render(<UserProfileView user={user} />);

      expect(screen.getByTestId('initial')).toHaveTextContent('テ');
    });
  });
});
