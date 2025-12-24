import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UserSearchInput from './UserSearchInput';

describe('UserSearchInput', () => {
  describe('レンダリング', () => {
    it('入力欄が表示される', () => {
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="" setQuery={mockSetQuery} isLoading={false} />);

      const input = screen.getByPlaceholderText('ユーザー名で検索');
      expect(input).toBeInTheDocument();
    });

    it('propsで渡されたqueryが入力欄に表示される', () => {
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="test query" setQuery={mockSetQuery} isLoading={false} />);

      const input = screen.getByPlaceholderText('ユーザー名で検索');
      expect(input).toHaveValue('test query');
    });
  });

  describe('ユーザー操作', () => {
    it('テキストを入力するとsetQueryが呼ばれる', async () => {
      const user = userEvent.setup();
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="" setQuery={mockSetQuery} isLoading={false} />);

      const input = screen.getByPlaceholderText('ユーザー名で検索');
      await user.type(input, 'test');

      // 各文字ごとにsetQueryが呼ばれる
      expect(mockSetQuery).toHaveBeenCalledTimes(4);
      expect(mockSetQuery).toHaveBeenNthCalledWith(1, 't');
      expect(mockSetQuery).toHaveBeenNthCalledWith(2, 'e');
      expect(mockSetQuery).toHaveBeenNthCalledWith(3, 's');
      expect(mockSetQuery).toHaveBeenNthCalledWith(4, 't');
    });

    it('入力欄をクリアするとsetQueryが空文字で呼ばれる', async () => {
      const user = userEvent.setup();
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="test" setQuery={mockSetQuery} isLoading={false} />);

      const input = screen.getByPlaceholderText('ユーザー名で検索');
      await user.clear(input);

      expect(mockSetQuery).toHaveBeenCalledWith('');
    });
  });

  describe('ローディング状態', () => {
    it('isLoading が false の場合、スピナーが表示されない', () => {
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="" setQuery={mockSetQuery} isLoading={false} />);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('isLoading が true の場合、スピナーが表示される', () => {
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="test" setQuery={mockSetQuery} isLoading={true} />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('入力欄がtext typeである', () => {
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="" setQuery={mockSetQuery} isLoading={false} />);

      const input = screen.getByPlaceholderText('ユーザー名で検索');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('プレースホルダーが適切に設定されている', () => {
      const mockSetQuery = vi.fn();
      render(<UserSearchInput query="" setQuery={mockSetQuery} isLoading={false} />);

      const input = screen.getByPlaceholderText('ユーザー名で検索');
      expect(input).toHaveAttribute('placeholder', 'ユーザー名で検索');
    });
  });
});
