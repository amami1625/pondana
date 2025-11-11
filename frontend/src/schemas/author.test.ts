import { describe, expect, it } from 'vitest';
import { authorFormSchema } from './author';
import { ZodError } from 'zod';

describe('authorFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみで著者データを作成できる', () => {
      const validData = {
        name: 'testAuthor',
      };

      const result = authorFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('name が 1 文字の場合通る', () => {
        const validData = { name: 'a' };
        const result = authorFormSchema.parse(validData);
        expect(result.name).toBe('a');
      });

      it('name が 100 文字の場合通る', () => {
        const validData = { name: 'a'.repeat(100) };
        const result = authorFormSchema.parse(validData);
        expect(result.name).toHaveLength(100);
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('name が空文字列の場合エラーを返す', () => {
      const invalidData = {
        name: '',
      };

      expect(() => authorFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('name 100文字を超える場合エラーを返す', () => {
      const invalidData = { name: 'a'.repeat(101) };

      expect(() => authorFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('name が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          name: '   ',
        };

        expect(() => authorFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('name が数値の場合エラーを返す', () => {
        const invalidData = {
          name: 123,
        };

        expect(() => authorFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド name が欠落している場合エラーを返す', () => {
        const invalidData = {};

        expect(() => authorFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('name が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: '',
      };

      const result = authorFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('著者名を入力してください');
    });

    it('name が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = { name: 'a'.repeat(101) };

      const result = authorFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('著者名は100文字以内で入力してください');
    });
  });
});
