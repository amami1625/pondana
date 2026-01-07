import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockTagStats } from '@/test/factories/dashboard';
import TagChart from './TagChart';

describe('TagChart', () => {
  describe('データが存在する場合', () => {
    it('タイトルとチャートが表示される', () => {
      const data = createMockTagStats();
      render(<TagChart data={data} />);

      expect(screen.getByText('タグ別（上位10件）')).toBeInTheDocument();
      expect(screen.getByTestId('tagChart')).toBeInTheDocument();
    });
  });

  describe('データが存在しない場合', () => {
    it('タイトルと空状態メッセージが表示される', () => {
      render(<TagChart data={[]} />);

      expect(screen.getByText('タグ別（上位10件）')).toBeInTheDocument();
      expect(screen.getByText('データがありません')).toBeInTheDocument();
    });
  });
});
