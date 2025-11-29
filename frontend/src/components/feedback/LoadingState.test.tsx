import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingState from './LoadingState';

describe('LoadingState', () => {
  describe('role と aria 属性', () => {
    it('role="status"が適用される', () => {
      render(<LoadingState />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('aria-live="polite"が適用される', () => {
      render(<LoadingState />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('message', () => {
    it('デフォルトのローディングメッセージが表示される', () => {
      render(<LoadingState />);

      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });

    it('設定したローディングメッセージが表示される', () => {
      render(<LoadingState message="データを取得中" />);

      expect(screen.getByText('データを取得中')).toBeInTheDocument();
    });

    it('メッセージがstatus要素内に含まれる', () => {
      render(<LoadingState message="読み込み中" />);

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('読み込み中');
    });
  });

  describe('variant', () => {
    it('cardバリアントの場合、カードスタイルが適用される', () => {
      render(<LoadingState variant="card" />);

      const status = screen.getByRole('status');
      expect(status).toHaveClass('rounded-lg');
      expect(status).toHaveClass('border');
      expect(status).toHaveClass('bg-white');
    });

    it('simpleバリアントの場合、シンプルなスタイルが適用される', () => {
      render(<LoadingState variant="simple" />);

      const status = screen.getByRole('status');
      expect(status).toHaveClass('py-12');
      expect(status).not.toHaveClass('rounded-lg');
    });
  });

  describe('showSpinner', () => {
    it('デフォルトでスピナーが表示される', () => {
      render(<LoadingState />);

      expect(screen.getByLabelText('読み込み中')).toBeInTheDocument();
    });

    it('showSpinner=falseの場合、スピナーが表示されない', () => {
      render(<LoadingState showSpinner={false} />);

      expect(screen.queryByLabelText('読み込み中')).not.toBeInTheDocument();
    });
  });

  describe('className', () => {
    it('カスタムクラスが追加で適用される', () => {
      render(<LoadingState className="custom-class" />);

      expect(screen.getByRole('status')).toHaveClass('custom-class');
    });

    it('カスタムクラスがデフォルトスタイルと共存する', () => {
      render(<LoadingState className="custom-class" />);

      const status = screen.getByRole('status');
      expect(status).toHaveClass('custom-class');
      expect(status).toHaveClass('rounded-lg');
    });
  });
});
