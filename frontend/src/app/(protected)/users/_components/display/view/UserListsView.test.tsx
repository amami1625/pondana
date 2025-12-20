import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createMockList } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import UserListsView from './UserListsView';

describe('UserListsView', () => {
  describe('レイアウト', () => {
    it('タイトル「公開リスト」が表示される', () => {
      const lists = [createMockList()];

      render(<UserListsView lists={lists} />);

      expect(screen.getByRole('heading', { name: '公開リスト' })).toBeInTheDocument();
    });
  });

  describe('リストのレンダリング', () => {
    it('リストが一つの場合、そのリストのタイトルが表示される', () => {
      const lists = [
        createMockList({
          id: createTestUuid(1),
          name: 'テストリスト',
        }),
      ];

      render(<UserListsView lists={lists} />);

      expect(screen.getByText('テストリスト')).toBeInTheDocument();
    });

    it('リストが複数存在する場合、全てのリストのタイトルが表示される', () => {
      const lists = [
        createMockList({
          id: createTestUuid(1),
          name: 'テストリスト1',
        }),
        createMockList({
          id: createTestUuid(2),
          name: 'テストリスト2',
        }),
      ];

      render(<UserListsView lists={lists} />);

      expect(screen.getByText('テストリスト1')).toBeInTheDocument();
      expect(screen.getByText('テストリスト2')).toBeInTheDocument();
    });
  });

  describe('リストが存在しない場合', () => {
    it('タイトルは表示される', () => {
      render(<UserListsView lists={[]} />);

      expect(screen.getByRole('heading', { name: '公開リスト' })).toBeInTheDocument();
    });

    it('空の状態メッセージが表示される', () => {
      render(<UserListsView lists={[]} />);

      expect(screen.getByText('公開しているリストはありません')).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    it('空配列の lists が渡されてもエラーにならない', () => {
      expect(() => render(<UserListsView lists={[]} />)).not.toThrow();
    });
  });
});
