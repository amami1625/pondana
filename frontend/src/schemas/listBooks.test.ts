import { describe, expect, it } from 'vitest';
import { listBookFormSchema } from './listBooks';
import { ZodError } from 'zod';

describe('listBookFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみでリストに追加するデータを作成できる', () => {
      const validData = {
        list_id: 1,
        book_id: 1,
      };

      const result = listBookFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    describe('エッジケース', () => {
      it('list_id が 0 の場合エラーを返す', () => {
        const invalidData = {
          list_id: 0,
          book_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('list_id が負の数の場合エラーを返す', () => {
        const invalidData = {
          list_id: -1,
          book_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('list_id が少数の場合エラーを返す', () => {
        const invalidData = {
          list_id: 2.5,
          book_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('list_id が文字列の場合エラーを返す', () => {
        const invalidData = {
          list_id: '1',
          book_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('book_id が文字列の場合エラーを返す', () => {
        const invalidData = {
          list_id: 1,
          book_id: '1',
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド list_id が欠落している場合エラーを返す', () => {
        const invalidData = {
          book_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド book_id が欠落している場合エラーを返す', () => {
        const invalidData = {
          list_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });
});
