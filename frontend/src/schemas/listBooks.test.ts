import { describe, expect, it } from 'vitest';
import { listBookFormSchema } from './listBooks';
import { ZodError } from 'zod';
import { createTestUuid } from '@/test/helpers';

describe('listBookFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみでリストに追加するデータを作成できる', () => {
      const validData = {
        list_id: createTestUuid(1),
        book_id: createTestUuid(1),
      };

      const result = listBookFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    describe('UUID形式の検証', () => {
      it('list_id が無効なUUID形式の場合エラーを返す', () => {
        const invalidData = {
          list_id: 'invalid-uuid',
          book_id: createTestUuid(1),
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('list_id が空文字列の場合エラーを返す', () => {
        const invalidData = {
          list_id: '',
          book_id: createTestUuid(1),
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('list_id が数値の場合エラーを返す', () => {
        const invalidData = {
          list_id: 1,
          book_id: createTestUuid(1),
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('book_id が無効なUUID形式の場合エラーを返す', () => {
        const invalidData = {
          list_id: createTestUuid(1),
          book_id: 'invalid-uuid',
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('book_id が空文字列の場合エラーを返す', () => {
        const invalidData = {
          list_id: createTestUuid(1),
          book_id: '',
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('book_id が数値の場合エラーを返す', () => {
        const invalidData = {
          list_id: createTestUuid(1),
          book_id: 1,
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('必須フィールド', () => {
      it('list_id が欠落している場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('book_id が欠落している場合エラーを返す', () => {
        const invalidData = {
          list_id: createTestUuid(1),
        };

        expect(() => listBookFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });
});
