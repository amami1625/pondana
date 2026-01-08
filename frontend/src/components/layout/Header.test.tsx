import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createBrowserSupabaseClient } from '@/supabase/clients/browser';
import Header from './Header';

// Supabaseクライアントをモック化
vi.mock('@/supabase/clients/browser', () => ({
  createBrowserSupabaseClient: vi.fn(),
}));

// LogoutButtonをモック化
vi.mock('@/app/(auth)/logout/LogoutButton', () => ({
  LogoutButton: () => <button>ログアウト</button>,
}));

describe('Header', () => {
  const mockOnAuthStateChange = vi.fn();
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Supabaseクライアントのモック設定
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: mockUnsubscribe,
        },
      },
    });

    vi.mocked(createBrowserSupabaseClient).mockReturnValue({
      auth: {
        onAuthStateChange: mockOnAuthStateChange,
      },
    } as never);
  });

  describe('未認証状態', () => {
    beforeEach(() => {
      render(<Header initialAuth={false} />);
    });

    it('header要素が存在する', () => {
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('アプリ名が表示される', () => {
      expect(screen.getByText('ぽんダナ')).toBeInTheDocument();
    });

    it('アプリ名のリンクがトップページ(/)を指す', () => {
      const link = screen.getByRole('link', { name: 'ぽんダナ' });
      expect(link).toHaveAttribute('href', '/');
    });

    it('Aboutリンクが表示される', () => {
      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('新規登録リンクが表示される', () => {
      const registerLink = screen.getByRole('link', { name: '新規登録' });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('ログインリンクが表示される', () => {
      const loginLink = screen.getByRole('link', { name: 'ログイン' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('ログアウトボタンは表示されない', () => {
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });

  describe('認証済み状態', () => {
    beforeEach(() => {
      render(<Header initialAuth={true} />);
    });

    it('アプリ名のリンクが/topを指す', () => {
      const link = screen.getByRole('link', { name: 'ぽんダナ' });
      expect(link).toHaveAttribute('href', '/top');
    });

    it('Aboutリンクが表示される', () => {
      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('ログアウトボタンが表示される', () => {
      expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument();
    });

    it('新規登録リンクは表示されない', () => {
      expect(screen.queryByRole('link', { name: '新規登録' })).not.toBeInTheDocument();
    });

    it('ログインリンクは表示されない', () => {
      expect(screen.queryByRole('link', { name: 'ログイン' })).not.toBeInTheDocument();
    });
  });

  describe('initialAuth が undefined の場合', () => {
    it('未認証として扱われる', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: '新規登録' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'ログイン' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'ログアウト' })).not.toBeInTheDocument();
    });
  });
});
