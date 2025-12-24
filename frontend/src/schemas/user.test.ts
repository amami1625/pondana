import { describe, expect, it } from 'vitest';
import { userFormSchema, userStatsSchema, userWithStatsSchema } from './user';
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

describe('userStatsSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('統計情報を正しくパースできる', () => {
      const validData = {
        public_books: 10,
        public_lists: 5,
        following_count: 3,
        followers_count: 7,
      };

      const result = userStatsSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('統計情報が0の場合も正しくパースできる', () => {
      const validData = {
        public_books: 0,
        public_lists: 0,
        following_count: 0,
        followers_count: 0,
      };

      const result = userStatsSchema.parse(validData);

      expect(result).toEqual(validData);
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('public_books が文字列の場合エラーを返す', () => {
      const invalidData = {
        public_books: '10',
        public_lists: 5,
      };

      expect(() => userStatsSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('public_lists が欠落している場合エラーを返す', () => {
      const invalidData = {
        public_books: 10,
      };

      expect(() => userStatsSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('public_books が負の数の場合も受け入れる（バリデーションなし）', () => {
      const data = {
        public_books: -1,
        public_lists: 5,
        following_count: 0,
        followers_count: 0,
      };

      const result = userStatsSchema.parse(data);

      expect(result.public_books).toBe(-1);
    });
  });
});

describe('userWithStatsSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('ユーザー情報と統計情報を正しくパースできる', () => {
      const validData = {
        id: 1,
        supabase_uid: 'test-uid-123',
        name: 'テストユーザー',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00.000+09:00',
        updated_at: '2025-01-01T00:00:00.000+09:00',
        stats: {
          public_books: 10,
          public_lists: 5,
          following_count: 3,
          followers_count: 7,
        },
      };

      const result = userWithStatsSchema.parse(validData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストユーザー');
      expect(result.stats.public_books).toBe(10);
      expect(result.stats.public_lists).toBe(5);
    });

    it('avatar_url がnullの場合も正しくパースできる', () => {
      const validData = {
        id: 1,
        supabase_uid: 'test-uid-123',
        name: 'テストユーザー',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00.000+09:00',
        updated_at: '2025-01-01T00:00:00.000+09:00',
        stats: {
          public_books: 0,
          public_lists: 0,
          following_count: 0,
          followers_count: 0,
        },
      };

      const result = userWithStatsSchema.parse(validData);

      expect(result.avatar_url).toBeNull();
      expect(result.stats.public_books).toBe(0);
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('stats が欠落している場合エラーを返す', () => {
      const invalidData = {
        id: 1,
        supabase_uid: 'test-uid-123',
        name: 'テストユーザー',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00.000+09:00',
        updated_at: '2025-01-01T00:00:00.000+09:00',
      };

      expect(() => userWithStatsSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('stats.public_books が欠落している場合エラーを返す', () => {
      const invalidData = {
        id: 1,
        supabase_uid: 'test-uid-123',
        name: 'テストユーザー',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00.000+09:00',
        updated_at: '2025-01-01T00:00:00.000+09:00',
        stats: {
          public_lists: 5,
        },
      };

      expect(() => userWithStatsSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('id が文字列の場合エラーを返す', () => {
      const invalidData = {
        id: '1',
        supabase_uid: 'test-uid-123',
        name: 'テストユーザー',
        avatar_url: null,
        created_at: '2025-01-01T00:00:00.000+09:00',
        updated_at: '2025-01-01T00:00:00.000+09:00',
        stats: {
          public_books: 10,
          public_lists: 5,
        },
      };

      expect(() => userWithStatsSchema.parse(invalidData)).toThrow(ZodError);
    });
  });
});
