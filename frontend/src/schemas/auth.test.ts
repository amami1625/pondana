import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './auth';
import { ZodError } from 'zod';

describe('loginSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('有効なメールアドレスとパスワードでログインできる', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('password が 8 文字の場合通る', () => {
        const validData = {
          email: 'test@example.com',
          password: 'a'.repeat(8),
        };

        const result = loginSchema.parse(validData);

        expect(result.password).toHaveLength(8);
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('email が無効な形式の場合エラーを返す', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('password が 8 文字未満の場合エラーを返す', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('エッジケース', () => {
      it('email が空文字列の場合エラーを返す', () => {
        const invalidData = {
          email: '',
          password: 'password123',
        };

        expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('password が空文字列の場合エラーを返す', () => {
        const invalidData = {
          email: 'test@example.com',
          password: '',
        };

        expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('必須フィールド email が欠落している場合エラーを返す', () => {
        const invalidData = {
          password: 'password123',
        };

        expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド password が欠落している場合エラーを返す', () => {
        const invalidData = {
          email: 'test@example.com',
        };

        expect(() => loginSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('email が無効な形式の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const emailError = result.error?.issues.find((e) => e.path[0] === 'email');
      expect(emailError?.path).toEqual(['email']);
      expect(emailError?.message).toBe('有効なメールアドレスを入力してください');
    });

    it('password が短すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const passwordError = result.error?.issues.find((e) => e.path[0] === 'password');
      expect(passwordError?.path).toEqual(['password']);
      expect(passwordError?.message).toBe('パスワードは8文字以上で入力してください');
    });
  });
});

describe('registerSchema', () => {
  describe('正常系: 有効なデータを受け入れる', () => {
    it('有効なデータでユーザー登録できる', () => {
      const validData = {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      const result = registerSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    describe('境界値テスト', () => {
      it('name が 1 文字の場合通る', () => {
        const validData = {
          name: 'a',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        };

        const result = registerSchema.parse(validData);

        expect(result.name).toBe('a');
      });

      it('name が 50 文字の場合通る', () => {
        const validData = {
          name: 'a'.repeat(50),
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        };

        const result = registerSchema.parse(validData);

        expect(result.name).toHaveLength(50);
      });

      it('password が 8 文字の場合通る', () => {
        const validData = {
          name: 'テストユーザー',
          email: 'test@example.com',
          password: 'a'.repeat(8),
          passwordConfirmation: 'a'.repeat(8),
        };

        const result = registerSchema.parse(validData);

        expect(result.password).toHaveLength(8);
      });
    });
  });

  describe('異常系: 無効なデータを拒否する', () => {
    it('name が空文字列の場合エラーを返す', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('name が 50 文字を超える場合エラーを返す', () => {
      const invalidData = {
        name: 'a'.repeat(51),
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('email が無効な形式の場合エラーを返す', () => {
      const invalidData = {
        name: 'テストユーザー',
        email: 'invalid-email',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('password が 8 文字未満の場合エラーを返す', () => {
      const invalidData = {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'short',
        passwordConfirmation: 'short',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('passwordConfirmation が空文字列の場合エラーを返す', () => {
      const invalidData = {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: '',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
    });

    describe('カスタムバリデーション', () => {
      it('password と passwordConfirmation が一致しない場合エラーを返す', () => {
        const invalidData = {
          name: 'テストユーザー',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'different123',
        };

        expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
      });
    });

    describe('型検証', () => {
      it('必須フィールド name が欠落している場合エラーを返す', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        };

        expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド email が欠落している場合エラーを返す', () => {
        const invalidData = {
          name: 'テストユーザー',
          password: 'password123',
          passwordConfirmation: 'password123',
        };

        expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド password が欠落している場合エラーを返す', () => {
        const invalidData = {
          name: 'テストユーザー',
          email: 'test@example.com',
          passwordConfirmation: 'password123',
        };

        expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
      });

      it('必須フィールド passwordConfirmation が欠落している場合エラーを返す', () => {
        const invalidData = {
          name: 'テストユーザー',
          email: 'test@example.com',
          password: 'password123',
        };

        expect(() => registerSchema.parse(invalidData)).toThrow(ZodError);
      });
    });
  });

  describe('エラーメッセージの検証', () => {
    it('name が空の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('ユーザー名を入力してください');
    });

    it('name が長すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: 'a'.repeat(51),
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const nameError = result.error?.issues.find((e) => e.path[0] === 'name');
      expect(nameError?.path).toEqual(['name']);
      expect(nameError?.message).toBe('ユーザー名は50文字以内で入力してください');
    });

    it('email が無効な形式の場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: 'テストユーザー',
        email: 'invalid-email',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const emailError = result.error?.issues.find((e) => e.path[0] === 'email');
      expect(emailError?.path).toEqual(['email']);
      expect(emailError?.message).toBe('有効なメールアドレスを入力してください');
    });

    it('password が短すぎる場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'short',
        passwordConfirmation: 'short',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const passwordError = result.error?.issues.find((e) => e.path[0] === 'password');
      expect(passwordError?.path).toEqual(['password']);
      expect(passwordError?.message).toBe('パスワードは8文字以上で入力してください');
    });

    it('password と passwordConfirmation が一致しない場合、適切なエラーメッセージを返す', () => {
      const invalidData = {
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'different123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      const confirmError = result.error?.issues.find((e) => e.path[0] === 'passwordConfirmation');
      expect(confirmError?.path).toEqual(['passwordConfirmation']);
      expect(confirmError?.message).toBe('パスワードが一致しません');
    });
  });
});
