import { describe, expect, it } from 'vitest';
import { userFormSchema } from './user';
import { ZodError } from 'zod';

describe('userFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみでユーザーを作成できる', () => {
      const validData = {
        name: 'テストユーザー',
      };

      const result = userFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('全てのフィールドを含むユーザーを作成できる', () => {
      const validData = {
        name: 'テストユーザー',
        avatar_url: 'example.com',
      };

      const result = userFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('name が 1 文字の場合通る', () => {
        const validData = {
          name: 'a',
        };

        const result = userFormSchema.parse(validData);

        expect(result.name).toBe('a');
      });

      it('name が 50 文字の場合通る', () => {
        const validData = {
          name: 'a'.repeat(50),
        };

        const result = userFormSchema.parse(validData);

        expect(result.name).toHaveLength(50);
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('name が空文字列の場合エラーを返す', () => {
      const invalidData = {
        name: '',
      };

      expect(() => userFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('name が 50 文字を超える場合エラーを返す', () => {
      const invalidData = {
        name: 'a'.repeat(51),
      };

      expect(() => userFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('name が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          name: '   ',
        };

        expect(() => userFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('name が数値の場合エラーを返す', () => {
        const invalidData = {
          name: 123,
        };

        expect(() => userFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド name が欠落している場合エラーを返す', () => {
        const invalidData = {};

        expect(() => userFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('name が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: '',
      };

      const result = userFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('ユーザー名を入力してください');
    });

    it('name が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = { name: 'a'.repeat(51) };

      const result = userFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('ユーザー名は50文字以内で入力してください');
    });
  });

  describe('オプショナルフィールド', () => {
    it('avatar_url が空文字列でも通る', () => {
      const validData = {
        name: 'テストユーザー',
        avatar_url: '',
      };

      const result = userFormSchema.parse(validData);

      expect(result.avatar_url).toBe('');
    });
  });
});
