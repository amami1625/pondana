import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockRecentBooks } from '@/test/factories/dashboard';
import RecentBooks from './RecentBooks';

describe('RecentBooks', () => {
  describe('データが存在する場合', () => {
    it('タイトルと書籍リストが表示される', () => {
      const data = createMockRecentBooks();
      render(<RecentBooks data={data} />);

      expect(screen.getByText('最近の書籍')).toBeInTheDocument();
      expect(screen.getByText('リーダブルコード')).toBeInTheDocument();
    });
  });

  describe('データが存在しない場合', () => {
    it('タイトルと空状態メッセージが表示される', () => {
      render(<RecentBooks data={[]} />);

      expect(screen.getByText('最近の書籍')).toBeInTheDocument();
      expect(screen.getByText('書籍がまだ登録されていません')).toBeInTheDocument();
    });
  });
});
