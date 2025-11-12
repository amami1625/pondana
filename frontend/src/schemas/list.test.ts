import { describe, expect, it } from 'vitest';
import { listFormSchema } from './list';
import { ZodError } from 'zod';

describe('listFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみでリストを作成できる', () => {
      const validData = {
        name: 'テストリスト',
        public: false,
      };

      const result = listFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('全てのフィールドを含むリストを作成できる', () => {
      const validData = {
        name: 'テストリスト',
        description: 'これはテスト用の説明です',
        public: false,
      };

      const result = listFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('name が 1 文字の場合通る', () => {
        const validData = {
          name: 'a',
          description: '詳細',
          public: false,
        };

        const result = listFormSchema.parse(validData);

        expect(result.name).toBe('a');
      });

      it('name が 255 文字の場合通る', () => {
        const validData = {
          name: 'a'.repeat(255),
          description: '詳細',
          public: false,
        };

        const result = listFormSchema.parse(validData);

        expect(result.name).toHaveLength(255);
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('name が空文字列の場合エラーを返す', () => {
      const invalidData = {
        name: '',
        public: false,
      };

      expect(() => listFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('name が 255 文字を超える場合エラーを返す', () => {
      const invalidData = {
        name: 'a'.repeat(256),
        public: false,
      };

      expect(() => listFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('name が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          name: '   ',
          public: false,
        };

        expect(() => listFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('name が数値の場合エラーを返す', () => {
        const invalidData = {
          name: 123,
          public: false,
        };

        expect(() => listFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド name が欠落している場合エラーを返す', () => {
        const invalidData = {
          public: false,
        };

        expect(() => listFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド public が欠落している場合エラーを返す', () => {
        const invalidData = {
          name: 'テストリスト',
        };

        expect(() => listFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('name が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: '',
        public: false,
      };

      const result = listFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('リスト名を入力してください');
    });

    it('name が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = { name: 'a'.repeat(256), public: false };

      const result = listFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('リスト名は255文字以内で入力してください');
    });
  });

  describe('オプショナルフィールド', () => {
    it('description が未指定でも通る', () => {
      const validData = {
        name: 'テストリスト',
        public: false,
      };

      const result = listFormSchema.parse(validData);

      expect(result.description).toBeUndefined();
    });

    it('description が空文字列でも通る', () => {
      const validData = {
        name: 'テストリスト',
        description: '',
        public: false,
      };

      const result = listFormSchema.parse(validData);

      expect(result.description).toBe('');
    });
  });
});
