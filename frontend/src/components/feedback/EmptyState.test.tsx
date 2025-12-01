import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  describe('本の場合', () => {
    it('本のメッセージが表示される（list context）', () => {
      render(<EmptyState element="本" context="list" />);

      expect(screen.getByText('まだ本が登録されていません')).toBeInTheDocument();
      expect(screen.getByText('最初の本を登録してみましょう')).toBeInTheDocument();
    });

    it('本のメッセージが表示される（detail context）', () => {
      render(<EmptyState element="本" context="detail" />);

      expect(screen.getByText('まだ本が登録されていません')).toBeInTheDocument();
      expect(screen.getByText('リストに本を追加してみましょう')).toBeInTheDocument();
    });
  });

  describe('リストの場合', () => {
    it('リストのメッセージが表示される（list context）', () => {
      render(<EmptyState element="リスト" context="list" />);

      expect(screen.getByText('まだリストが登録されていません')).toBeInTheDocument();
      expect(screen.getByText('最初のリストを登録してみましょう')).toBeInTheDocument();
    });

    it('リストのメッセージが表示される（detail context）', () => {
      render(<EmptyState element="リスト" context="detail" />);

      expect(screen.getByText('まだリストに追加されていません')).toBeInTheDocument();
      expect(screen.getByText('本をリストに追加してみましょう')).toBeInTheDocument();
    });
  });

  describe('カードの場合', () => {
    it('カードのメッセージが表示される（list context）', () => {
      render(<EmptyState element="カード" context="list" />);

      expect(screen.getByText('まだカードが登録されていません')).toBeInTheDocument();
      expect(screen.getByText('最初のカードを登録してみましょう')).toBeInTheDocument();
    });

    it('カードのメッセージが表示される（detail context）', () => {
      render(<EmptyState element="カード" context="detail" />);

      expect(screen.getByText('まだカードが登録されていません')).toBeInTheDocument();
      expect(screen.getByText('カードを作成してメモを残しましょう')).toBeInTheDocument();
    });
  });

  describe('contextのデフォルト値', () => {
    it('contextを省略した場合、list contextとして扱われる', () => {
      render(<EmptyState element="本" />);

      expect(screen.getByText('まだ本が登録されていません')).toBeInTheDocument();
      expect(screen.getByText('最初の本を登録してみましょう')).toBeInTheDocument();
    });
  });
});
