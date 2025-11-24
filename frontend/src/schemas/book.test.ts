import { describe, expect, it } from 'vitest';
import { bookFormSchema } from './book';
import { ZodError } from 'zod';

describe('bookFormSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみで本を作成できる', () => {
      const validData = {
        title: 'テスト本',
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('全てのフィールドを含む本を作成できる', () => {
      const validData = {
        title: 'テスト本',
        description: 'これはテスト用の説明です',
        author_ids: [1, 2, 3],
        category_id: 5,
        rating: 4,
        reading_status: 'reading' as const,
        public: true,
      };

      const result = bookFormSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('title が 1 文字の場合通る', () => {
        const data = {
          title: 'a',
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.title).toBe('a');
      });

      it('title が 255 文字の場合通る', () => {
        const data = {
          title: 'a'.repeat(255),
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.title).toHaveLength(255);
      });

      it('rating が 1 の場合通る', () => {
        const data = {
          title: 'テスト本',
          author_ids: [1],
          rating: 1,
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.rating).toBe(1);
      });

      it('rating が 5 の場合通る', () => {
        const data = {
          title: 'テスト本',
          author_ids: [1],
          rating: 5,
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.rating).toBe(5);
      });

      it('author_ids が 1 個の要素の場合通る', () => {
        const data = {
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.author_ids).toHaveLength(1);
      });
    });

    describe('reading_status の全パターン', () => {
      it('reading_status が unread の場合通る', () => {
        const data = {
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.reading_status).toBe('unread');
      });

      it('reading_status が reading の場合通る', () => {
        const data = {
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'reading' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.reading_status).toBe('reading');
      });

      it('reading_status が completed の場合通る', () => {
        const data = {
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'completed' as const,
          public: false,
        };

        const result = bookFormSchema.parse(data);

        expect(result.reading_status).toBe('completed');
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('title が空文字列の場合エラーを返す', () => {
      const invalidData = {
        title: '',
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('title が 255 文字を超える場合エラーを返す', () => {
      const invalidData = {
        title: 'a'.repeat(256),
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('author_ids が空配列の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        author_ids: [],
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('rating が 0 の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        author_ids: [1],
        rating: 0,
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('rating が 6 の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        author_ids: [1],
        rating: 6,
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('reading_status が不正な値の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        author_ids: [1],
        reading_status: 'invalid' as const,
        public: false,
      };

      expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('title が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          title: '   ',
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('rating が小数の場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          author_ids: [1],
          rating: 2.5,
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('title が数値の場合エラーを返す', () => {
        const invalidData = {
          title: 123,
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('author_ids が文字列の場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          author_ids: 'not an array',
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド title が欠落している場合エラーを返す', () => {
        const invalidData = {
          author_ids: [1],
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド author_ids が欠落している場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド reading_status が欠落している場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          author_ids: [1],
          public: false,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド public が欠落している場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'unread' as const,
        };

        expect(() => bookFormSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('title が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        title: '',
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((e) => e.path[0] === 'title');
      expect(titleError?.path).toEqual(['title']);
      expect(titleError?.message).toBe('タイトルを入力してください');
    });

    it('title が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        title: 'a'.repeat(256),
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((e) => e.path[0] === 'title');
      expect(titleError?.path).toEqual(['title']);
      expect(titleError?.message).toBe('タイトルは255文字以内で入力してください');
    });

    it('author_ids が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        title: 'テスト本',
        author_ids: [],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const authorError = result.error?.issues.find((e) => e.path[0] === 'author_ids');
      expect(authorError?.path).toEqual(['author_ids']);
      expect(authorError?.message).toBe('著者を1人以上選択してください');
    });
  });

  describe('オプショナルフィールド', () => {
    it('description が未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.parse(data);

      expect(result.description).toBeUndefined();
    });

    it('category_id が未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.parse(data);

      expect(result.category_id).toBeUndefined();
    });

    it('rating が未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        author_ids: [1],
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookFormSchema.parse(data);

      expect(result.rating).toBeUndefined();
    });
  });
});
