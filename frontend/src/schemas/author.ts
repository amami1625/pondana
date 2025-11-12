import { z } from 'zod';

// Authorのバリデーションスキーマ(APIレスポンス用)
export const authorSchema = z.object({
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

// Authorのバリデーションスキーマ(フォーム用)
export const authorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: '著者名を入力してください' })
    .max(100, { message: '著者名は100文字以内で入力してください' }),
});

export type Author = z.infer<typeof authorSchema>;
export type AuthorFormData = z.infer<typeof authorFormSchema>;
