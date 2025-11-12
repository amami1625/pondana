import { z } from 'zod';

// categoryのバリデーションスキーマ(APIレスポンス用)
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  user_id: z.number(),
  created_at: z.string().transform((str) => {
    return new Date(str).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
  }),
  updated_at: z.string().transform((str) => {
    return new Date(str).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
  }),
});

// categoryのバリデーションスキーマ(フォーム用)
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'カテゴリ名を入力してください' })
    .max(100, { message: 'カテゴリ名は100文字以内で入力してください' }),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
