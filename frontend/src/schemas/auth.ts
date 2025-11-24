import { z } from 'zod';

// パスワードバリデーション（空白文字を含まない）
const passwordValidation = z
  .string()
  .min(8, { message: 'パスワードは8文字以上で入力してください' })
  .regex(/^\S+$/, { message: 'パスワードに空白文字は使用できません' });

export const loginSchema = z.object({
  email: z.email({ message: '有効なメールアドレスを入力してください' }),
  password: passwordValidation,
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'ユーザー名を入力してください' })
      .max(50, { message: 'ユーザー名は50文字以内で入力してください' }),
    email: z.email({ message: '有効なメールアドレスを入力してください' }),
    password: passwordValidation,
    passwordConfirmation: z.string().min(1, { message: 'パスワード確認を入力してください' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'], // エラーを表示するフィールドを指定
  });

export const currentPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: 'パスワードを入力してください' })
    .regex(/^\S+$/, { message: 'パスワードに空白文字は使用できません' }),
});

export const passwordChangeSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, { message: '確認用パスワードを入力してください' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export const emailChangeSchema = z.object({
  email: z.email({ message: '有効なメールアドレスを入力してください' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CurrentPasswordFormData = z.infer<typeof currentPasswordSchema>;
export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
