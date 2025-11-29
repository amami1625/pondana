import { BookOpen } from 'lucide-react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  describe('基本機能', () => {
    it('ラベルが正しく表示される', () => {
      render(
        <Button variant="primary" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByText('テスト')).toBeInTheDocument();
    });

    it('ボタン無効時にラベルが変更される', () => {
      render(
        <Button variant="primary" onClick={() => {}} disabled={true} loadingLabel="処理中">
          テスト
        </Button>,
      );

      expect(screen.getByText('処理中')).toBeInTheDocument();
    });

    it('アイコンが正しく表示される', () => {
      const { container } = render(
        <Button variant="primary" onClick={() => {}} icon={<BookOpen />}>
          テスト
        </Button>,
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('type が デフォルトで button になっている', () => {
      render(
        <Button variant="primary" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('type が submit のボタンを作れる', () => {
      render(
        <Button type="submit" variant="primary" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('アクション系のスタイル', () => {
    it('create 用のスタイルが適用される', () => {
      render(
        <Button variant="create" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass('bg-primary text-white hover:bg-primary/90');
    });

    it('update 用のスタイルが適用される', () => {
      render(
        <Button variant="update" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass('bg-green-600 text-white hover:bg-green-700');
    });

    it('delete 用のスタイルが適用される', () => {
      render(
        <Button variant="delete" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass('bg-red-600 text-white hover:bg-red-700');
    });

    it('cancel 用のスタイルが適用される', () => {
      render(
        <Button variant="cancel" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass(
        'bg-slate-200 text-slate-800 hover:bg-slate-300',
      );
    });
  });

  describe('汎用スタイル', () => {
    it('primary 用のスタイルが適用される', () => {
      render(
        <Button variant="primary" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass('bg-primary text-white hover:bg-primary/90');
    });

    it('secondary 用のスタイルが適用される', () => {
      render(
        <Button variant="secondary" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass(
        'bg-slate-200 text-slate-800 hover:bg-slate-300',
      );
    });

    it('danger 用のスタイルが適用される', () => {
      render(
        <Button variant="danger" onClick={() => {}}>
          テスト
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveClass('text-red-600 hover:bg-red-500/10');
    });
  });
});
