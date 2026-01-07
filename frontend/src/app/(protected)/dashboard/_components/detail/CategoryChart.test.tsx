import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockCategoryStats } from '@/test/factories/dashboard';
import CategoryChart from './CategoryChart';

describe('CategoryChart', () => {
  describe('データが存在する場合', () => {
    it('タイトルとチャートが表示される', () => {
      const data = createMockCategoryStats();
      render(<CategoryChart data={data} />);

      expect(screen.getByText('カテゴリー別')).toBeInTheDocument();
      expect(screen.getByTestId('categoryChart')).toBeInTheDocument();
    });
  });

  describe('データが存在しない場合', () => {
    it('タイトルと空状態メッセージが表示される', () => {
      render(<CategoryChart data={[]} />);

      expect(screen.getByText('カテゴリー別')).toBeInTheDocument();
      expect(screen.getByText('データがありません')).toBeInTheDocument();
    });
  });
});
