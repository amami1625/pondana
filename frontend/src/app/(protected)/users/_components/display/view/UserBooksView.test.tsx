import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Book } from '@/schemas/book';
import { createMockBook } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import UserBooksView from './UserBooksView';

describe('UserBooksView', () => {
  describe('レイアウト', () => {
    it('タイトル「本一覧」が表示される', () => {
      const books: Book[] = [createMockBook()];

      render(<UserBooksView books={books} />);

      expect(screen.getByRole('heading', { name: '本一覧' })).toBeInTheDocument();
    });
  });

  describe('本リストのレンダリング', () => {
    it('本が1冊の場合、その本のタイトルが表示される', () => {
      const books: Book[] = [
        createMockBook({
          id: createTestUuid(1),
          title: 'テスト本1',
        }),
      ];

      render(<UserBooksView books={books} />);

      // タイトルが表示されていることを確認（BookListCardがレンダリングされている）
      expect(screen.getByText('テスト本1')).toBeInTheDocument();
    });

    it('本が複数冊の場合、すべての本のタイトルが表示される', () => {
      const books: Book[] = [
        createMockBook({
          id: createTestUuid(1),
          title: 'テスト本1',
        }),
        createMockBook({
          id: createTestUuid(2),
          title: 'テスト本2',
        }),
      ];

      render(<UserBooksView books={books} />);

      // 各本のタイトルが表示されていることを確認
      // （BookListCardの表示の詳細はBookListCard.test.tsxでテストする）
      expect(screen.getByText('テスト本1')).toBeInTheDocument();
      expect(screen.getByText('テスト本2')).toBeInTheDocument();
    });
  });

  describe('本が存在しない場合', () => {
    it('タイトルは表示される', () => {
      render(<UserBooksView books={[]} />);

      expect(screen.getByRole('heading', { name: '本一覧' })).toBeInTheDocument();
    });

    it('空の状態メッセージが表示される', () => {
      render(<UserBooksView books={[]} />);

      expect(screen.getByText('公開している本はありません')).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    it('空配列の books が渡されてもエラーにならない', () => {
      expect(() => render(<UserBooksView books={[]} />)).not.toThrow();
    });
  });
});
