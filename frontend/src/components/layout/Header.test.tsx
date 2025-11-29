import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';

// LogoutButtonをモック化
vi.mock('@/app/(auth)/logout/LogoutButton', () => ({
  LogoutButton: () => <button>ログアウト</button>,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('未認証状態', () => {
    it('header要素が存在する', () => {
      render(<Header isAuthenticated={false} />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('アプリ名が表示される', () => {
      render(<Header isAuthenticated={false} />);

      expect(screen.getByText('ぽんダナ')).toBeInTheDocument();
    });

    it('アプリ名のリンクがトップページ(/)を指す', () => {
      render(<Header isAuthenticated={false} />);

      const link = screen.getByRole('link', { name: 'ぽんダナ' });
      expect(link).toHaveAttribute('href', '/');
    });

    it('新規登録リンクが表示される', () => {
      render(<Header isAuthenticated={false} />);

      const registerLink = screen.getByRole('link', { name: '新規登録' });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('ログインリンクが表示される', () => {
      render(<Header isAuthenticated={false} />);

      const loginLink = screen.getByRole('link', { name: 'ログイン' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('ログアウトボタンは表示されない', () => {
      render(<Header isAuthenticated={false} />);

      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });

  describe('認証済み状態', () => {
    it('アプリ名のリンクが/topを指す', () => {
      render(<Header isAuthenticated={true} />);

      const link = screen.getByRole('link', { name: 'ぽんダナ' });
      expect(link).toHaveAttribute('href', '/top');
    });

    it('ログアウトボタンが表示される', () => {
      render(<Header isAuthenticated={true} />);

      expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument();
    });

    it('新規登録リンクは表示されない', () => {
      render(<Header isAuthenticated={true} />);

      expect(screen.queryByRole('link', { name: '新規登録' })).not.toBeInTheDocument();
    });

    it('ログインリンクは表示されない', () => {
      render(<Header isAuthenticated={true} />);

      expect(screen.queryByRole('link', { name: 'ログイン' })).not.toBeInTheDocument();
    });
  });

  describe('isAuthenticated が undefined の場合', () => {
    it('未認証として扱われる', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: '新規登録' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'ログイン' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });
});
