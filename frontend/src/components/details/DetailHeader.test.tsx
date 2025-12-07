import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailHeader from './DetailHeader';

describe('DetailHeader', () => {
  describe('title', () => {
    it('タイトルが正しく表示されている', () => {
      render(<DetailHeader title="タイトル" />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('タイトル');
    });
  });

  describe('subtitle', () => {
    it('サブタイトルが存在する場合、正しく表示されている', () => {
      render(<DetailHeader title="タイトル" subtitle="サブタイトル" />);

      expect(screen.getByText('サブタイトル')).toBeInTheDocument();
    });

    it('サブタイトルが存在しない場合、表示されない', () => {
      render(<DetailHeader title="タイトル" />);

      expect(screen.queryByText('サブタイトル')).not.toBeInTheDocument();
    });
  });

  describe('badges', () => {
    it('バッジが存在する場合、正しく表示されている', () => {
      render(<DetailHeader title="タイトル" badges="バッジ" />);

      expect(screen.getByText('バッジ')).toBeInTheDocument();
    });

    it('バッジが存在しない場合、表示されない', () => {
      render(<DetailHeader title="タイトル" />);

      expect(screen.queryByText('バッジ')).not.toBeInTheDocument();
    });
  });
});
