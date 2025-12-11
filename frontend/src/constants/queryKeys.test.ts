import { describe, expect, it } from 'vitest';
import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  describe('categories', () => {
    it('categories.all が正しいキーを返す', () => {
      expect(queryKeys.categories.all).toEqual(['categories']);
    });
  });

  describe('lists', () => {
    it('lists.all が正しいキーを返す', () => {
      expect(queryKeys.lists.all).toEqual(['lists']);
    });

    it('lists.detail が正しいキーを返す', () => {
      expect(queryKeys.lists.detail('1')).toEqual(['lists', 'detail', '1']);
    });

    it('lists.detail が異なるIDで正しいキーを返す', () => {
      expect(queryKeys.lists.detail('999')).toEqual(['lists', 'detail', '999']);
    });
  });

  describe('books', () => {
    it('books.all が正しいキーを返す', () => {
      expect(queryKeys.books.all).toEqual(['books']);
    });

    it('books.detail が正しいキーを返す', () => {
      expect(queryKeys.books.detail('1')).toEqual(['books', 'detail', '1']);
    });

    it('books.detail が異なるIDで正しいキーを返す', () => {
      expect(queryKeys.books.detail('999')).toEqual(['books', 'detail', '999']);
    });
  });

  describe('cards', () => {
    it('cards.all が正しいキーを返す', () => {
      expect(queryKeys.cards.all).toEqual(['cards']);
    });

    it('cards.detail が正しいキーを返す', () => {
      expect(queryKeys.cards.detail('1')).toEqual(['cards', 'detail', '1']);
    });

    it('cards.detail が異なるIDで正しいキーを返す', () => {
      expect(queryKeys.cards.detail('999')).toEqual(['cards', 'detail', '999']);
    });
  });

  describe('profile', () => {
    it('profile.all が正しいキーを返す', () => {
      expect(queryKeys.profile.all).toEqual(['profile']);
    });
  });

  describe('top', () => {
    it('top.all が正しいキーを返す', () => {
      expect(queryKeys.top.all).toEqual(['top']);
    });
  });
});
