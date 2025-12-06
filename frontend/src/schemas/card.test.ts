import { describe, expect, it } from 'vitest';
import { cardFormSchema } from './card';
import { ZodError } from 'zod';
import { createTestUuid } from '@/test/helpers';

describe('cardFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみでカードを作成できる', () => {
      const validData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: 'テストコンテンツ',
      };

      const result = cardFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('title が 1 文字の場合通る', () => {
        const validData = {
          book_id: createTestUuid(1),
          title: 'a',
          content: 'テストコンテンツ',
        };

        const result = cardFormSchema.parse(validData);

        expect(result).toEqual(validData);
      });

      it('title が 255 文字の場合通る', () => {
        const validData = {
          book_id: createTestUuid(1),
          title: 'a'.repeat(255),
          content: 'テストコンテンツ',
        };

        const result = cardFormSchema.parse(validData);

        expect(result.title).toHaveLength(255);
      });

      it('content が 1 文字の場合通る', () => {
        const validData = {
          book_id: createTestUuid(1),
          title: 'テストカード',
          content: 'a',
        };

        const result = cardFormSchema.parse(validData);

        expect(result).toEqual(validData);
      });

      it('content が 10000 文字の場合通る', () => {
        const validData = {
          book_id: createTestUuid(1),
          title: 'テストカード',
          content: 'a'.repeat(10000),
        };

        const result = cardFormSchema.parse(validData);

        expect(result.content).toHaveLength(10000);
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('title が空文字列の場合エラーを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: '',
        content: 'テストコンテンツ',
      };

      expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('title が 255 文字を超える場合エラーを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: 'a'.repeat(256),
        content: 'テストコンテンツ',
      };

      expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('content が空文字列場合エラーを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: '',
      };

      expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('content が 10000 文字を超える場合エラーを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: 'a'.repeat(10001),
      };

      expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('title が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
          title: '   ',
          content: 'テストコンテンツ',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('content が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
          title: 'テストカード',
          content: '   ',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('book_id が無効な形式（非UUID文字列）の場合エラーを返す', () => {
        const invalidData = {
          book_id: '1',
          title: 'テストカード',
          content: 'テストコンテンツ',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('title が数値の場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
          title: 123,
          content: 'テストコンテンツ',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('content が数値の場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
          title: 'テストタイトル',
          content: 123,
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド book_id が欠落している場合エラーを返す', () => {
        const invalidData = {
          title: 'テストタイトル',
          content: 'テストコンテンツ',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド title が欠落している場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
          content: 'テストコンテンツ',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド content が欠落している場合エラーを返す', () => {
        const invalidData = {
          book_id: createTestUuid(1),
          title: 'テストタイトル',
        };

        expect(() => cardFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('title が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: '',
        content: 'テストコンテンツ',
      };

      const result = cardFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((e) => e.path[0] === 'title');
      expect(titleError?.path).toEqual(['title']);
      expect(titleError?.message).toBe('タイトルを入力してください');
    });

    it('title が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: 'a'.repeat(256),
        content: 'テストコンテンツ',
      };

      const result = cardFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((e) => e.path[0] === 'title');
      expect(titleError?.path).toEqual(['title']);
      expect(titleError?.message).toBe('タイトルは255文字以内で入力してください');
    });

    it('content が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: '',
      };

      const result = cardFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const contentError = result.error?.issues.find((e) => e.path[0] === 'content');
      expect(contentError?.path).toEqual(['content']);
      expect(contentError?.message).toBe('本文を入力してください');
    });

    it('content が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: 'a'.repeat(10001),
      };

      const result = cardFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const contentError = result.error?.issues.find((e) => e.path[0] === 'content');
      expect(contentError?.path).toEqual(['content']);
      expect(contentError?.message).toBe('本文は10000文字以内で入力してください');
    });
  });
});
