import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AuthLayout from './AuthLayout';

describe('AuthLayout', () => {
  describe('表示', () => {
    it('タイトルが表示される', () => {
      render(
        <AuthLayout title="ログイン" alternativeText="新規登録" alternativeHref="/register">
          <div>test content</div>
        </AuthLayout>,
      );

      expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    });

    it('children が表示される', () => {
      render(
        <AuthLayout title="ログイン" alternativeText="新規登録" alternativeHref="/register">
          <div>test content</div>
        </AuthLayout>,
      );

      expect(screen.getByText('test content')).toBeInTheDocument();
    });

    it('代替テキストとリンクが表示される', () => {
      render(
        <AuthLayout title="ログイン" alternativeText="新規登録" alternativeHref="/register">
          <div>test content</div>
        </AuthLayout>,
      );

      expect(screen.getByText('または')).toBeInTheDocument();

      const link = screen.getByRole('link', { name: '新規登録' });
      expect(link).toHaveAttribute('href', '/register');
    });
  });

  describe('異なる props での動作', () => {
    it('登録ページのレイアウトが正しく表示される', () => {
      render(
        <AuthLayout title="新規登録" alternativeText="ログイン" alternativeHref="/login">
          <div>register form</div>
        </AuthLayout>,
      );

      expect(screen.getByRole('heading', { name: '新規登録' })).toBeInTheDocument();

      const link = screen.getByRole('link', { name: 'ログイン' });
      expect(link).toHaveAttribute('href', '/login');

      expect(screen.getByText('register form')).toBeInTheDocument();
    });
  });
});
