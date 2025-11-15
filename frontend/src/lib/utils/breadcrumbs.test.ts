import { describe, it, expect } from 'vitest';
import {
  getBookDetailBreadcrumbs,
  getListDetailBreadcrumbs,
  getCardDetailBreadcrumbs,
} from './breadcrumbs';
import { BREADCRUMB_PATHS } from '@/constants/breadcrumbs';

describe('breadcrumbs', () => {
  describe('getBookDetailBreadcrumbs', () => {
    it('書籍タイトルを含む正しいパンくずリストを返す', () => {
      const bookTitle = 'testBook';
      const result = getBookDetailBreadcrumbs(bookTitle);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(BREADCRUMB_PATHS.home);
      expect(result[1]).toEqual(BREADCRUMB_PATHS.books);
      expect(result[2]).toEqual({ label: bookTitle });
    });

    it('最後の要素にhrefが含まれない', () => {
      const result = getBookDetailBreadcrumbs('testBook');
      expect(result[2]).not.toHaveProperty('href');
    });
  });

  describe('getListDetailBreadcrumbs', () => {
    it('リスト名を含む正しいパンくずリストを返す', () => {
      const listName = 'testList';
      const result = getListDetailBreadcrumbs(listName);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(BREADCRUMB_PATHS.home);
      expect(result[1]).toEqual(BREADCRUMB_PATHS.lists);
      expect(result[2]).toEqual({ label: listName });
    });

    it('最後の要素にhrefが含まれない', () => {
      const result = getListDetailBreadcrumbs('testList');
      expect(result[2]).not.toHaveProperty('href');
    });
  });

  describe('getCardDetailBreadcrumbs', () => {
    it('カードタイトルを含む正しいパンくずリストを返す', () => {
      const cardTitle = 'testCard';
      const result = getCardDetailBreadcrumbs(cardTitle);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(BREADCRUMB_PATHS.home);
      expect(result[1]).toEqual(BREADCRUMB_PATHS.cards);
      expect(result[2]).toEqual({ label: cardTitle });
    });

    it('最後の要素にhrefが含まれない', () => {
      const result = getCardDetailBreadcrumbs('testCard');
      expect(result[2]).not.toHaveProperty('href');
    });
  });

  describe('すべての関数の共通仕様', () => {
    it('すべての関数が同じ構造を返す', () => {
      const bookBreadcrumbs = getBookDetailBreadcrumbs('book');
      const listBreadcrumbs = getListDetailBreadcrumbs('list');
      const cardBreadcrumbs = getCardDetailBreadcrumbs('card');

      // すべて3要素
      expect(bookBreadcrumbs).toHaveLength(3);
      expect(listBreadcrumbs).toHaveLength(3);
      expect(cardBreadcrumbs).toHaveLength(3);

      // すべて最初の要素がホーム
      expect(bookBreadcrumbs[0]).toEqual(BREADCRUMB_PATHS.home);
      expect(listBreadcrumbs[0]).toEqual(BREADCRUMB_PATHS.home);
      expect(cardBreadcrumbs[0]).toEqual(BREADCRUMB_PATHS.home);
    });

    it('空文字列でも動作する', () => {
      const result = getBookDetailBreadcrumbs('');
      expect(result).toHaveLength(3);
      expect(result[2]).toEqual({ label: '' });
    });

    it('特殊文字を含むタイトルでも動作する', () => {
      const specialTitle = 'React & Next.js: 完全ガイド（2024年版）';
      const result = getBookDetailBreadcrumbs(specialTitle);
      expect(result[2]).toEqual({ label: specialTitle });
    });
  });
});
