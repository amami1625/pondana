import { describe, expect, it } from 'vitest';
import { bookCreateSchema, bookUpdateSchema } from './book';
import { ZodError } from 'zod';

describe('bookCreateSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみで本を作成できる', () => {
      const validData = {
        title: 'テスト本',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookCreateSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('全てのフィールドを含む本を作成できる', () => {
      const validData = {
        google_books_id: 'abc123',
        isbn: '9784873117836',
        title: 'テスト本',
        subtitle: 'サブタイトル',
        thumbnail: 'http://example.com/image.jpg',
        authors: ['テスト著者'],
        description: 'これはテスト用の説明です',
        category_id: 5,
        tag_ids: [1, 2],
        rating: 4,
        reading_status: 'reading' as const,
        public: true,
      };

      const result = bookCreateSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('title が 1 文字の場合通る', () => {
        const data = {
          title: 'a',
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookCreateSchema.parse(data);

        expect(result.title).toBe('a');
      });

      it('rating が 1 の場合通る', () => {
        const data = {
          title: 'テスト本',
          rating: 1,
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookCreateSchema.parse(data);

        expect(result.rating).toBe(1);
      });

      it('rating が 5 の場合通る', () => {
        const data = {
          title: 'テスト本',
          rating: 5,
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookCreateSchema.parse(data);

        expect(result.rating).toBe(5);
      });
    });

    describe('reading_status の全パターン', () => {
      it('reading_status が unread の場合通る', () => {
        const data = {
          title: 'テスト本',
          reading_status: 'unread' as const,
          public: false,
        };

        const result = bookCreateSchema.parse(data);

        expect(result.reading_status).toBe('unread');
      });

      it('reading_status が reading の場合通る', () => {
        const data = {
          title: 'テスト本',
          reading_status: 'reading' as const,
          public: false,
        };

        const result = bookCreateSchema.parse(data);

        expect(result.reading_status).toBe('reading');
      });

      it('reading_status が completed の場合通る', () => {
        const data = {
          title: 'テスト本',
          reading_status: 'completed' as const,
          public: false,
        };

        const result = bookCreateSchema.parse(data);

        expect(result.reading_status).toBe('completed');
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('title が空文字列の場合エラーを返す', () => {
      const invalidData = {
        title: '',
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('rating が 0 の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        rating: 0,
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('rating が 6 の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        rating: 6,
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('reading_status が不正な値の場合エラーを返す', () => {
      const invalidData = {
        title: 'テスト本',
        reading_status: 'invalid' as const,
        public: false,
      };

      expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('title が空白文字のみの場合エラーを返す', () => {
        const invalidData = {
          title: '   ',
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('rating が小数の場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          rating: 2.5,
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('title が数値の場合エラーを返す', () => {
        const invalidData = {
          title: 123,
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド title が欠落している場合エラーを返す', () => {
        const invalidData = {
          reading_status: 'unread' as const,
          public: false,
        };

        expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド reading_status が欠落している場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          public: false,
        };

        expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド public が欠落している場合エラーを返す', () => {
        const invalidData = {
          title: 'テスト本',
          reading_status: 'unread' as const,
        };

        expect(() => bookCreateSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('title が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        title: '',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookCreateSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const titleError = result.error?.issues.find((e) => e.path[0] === 'title');
      expect(titleError?.path).toEqual(['title']);
      expect(titleError?.message).toBe('タイトルを入力してください');
    });
  });

  describe('オプショナルフィールド', () => {
    it('description が未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookCreateSchema.parse(data);

      expect(result.description).toBeUndefined();
    });

    it('category_id が未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookCreateSchema.parse(data);

      expect(result.category_id).toBeUndefined();
    });

    it('rating が未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookCreateSchema.parse(data);

      expect(result.rating).toBeUndefined();
    });

    it('Google Books APIのフィールドが未指定でも通る', () => {
      const data = {
        title: 'テスト本',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookCreateSchema.parse(data);

      expect(result.google_books_id).toBeUndefined();
      expect(result.isbn).toBeUndefined();
      expect(result.subtitle).toBeUndefined();
      expect(result.thumbnail).toBeUndefined();
      expect(result.authors).toBeUndefined();
    });
  });
});

describe('bookUpdateSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('必須フィールドのみで本を更新できる', () => {
      const validData = {
        id: 'test-uuid',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookUpdateSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('全てのフィールドを含む本を更新できる', () => {
      const validData = {
        id: 'test-uuid',
        description: 'これはテスト用の説明です',
        category_id: 5,
        tag_ids: [1, 2],
        rating: 4,
        reading_status: 'reading' as const,
        public: true,
      };

      const result = bookUpdateSchema.parse(validData);

      expect(result).toEqual(validData);
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('id が欠落している場合エラーを返す', () => {
      const invalidData = {
        reading_status: 'unread' as const,
        public: false,
      };

      expect(() => bookUpdateSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('reading_status が欠落している場合エラーを返す', () => {
      const invalidData = {
        id: 'test-uuid',
        public: false,
      };

      expect(() => bookUpdateSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('public が欠落している場合エラーを返す', () => {
      const invalidData = {
        id: 'test-uuid',
        reading_status: 'unread' as const,
      };

      expect(() => bookUpdateSchema.parse(invalidData)).toThrow(ZodError);
    });
  });

  describe('オプショナルフィールド', () => {
    it('description が未指定でも通る', () => {
      const data = {
        id: 'test-uuid',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookUpdateSchema.parse(data);

      expect(result.description).toBeUndefined();
    });

    it('category_id が未指定でも通る', () => {
      const data = {
        id: 'test-uuid',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookUpdateSchema.parse(data);

      expect(result.category_id).toBeUndefined();
    });

    it('rating が未指定でも通る', () => {
      const data = {
        id: 'test-uuid',
        reading_status: 'unread' as const,
        public: false,
      };

      const result = bookUpdateSchema.parse(data);

      expect(result.rating).toBeUndefined();
    });
  });
});
