import { z } from 'zod';

// tagのバリデーションスキーマ(APIレスポンス用)
export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  user_id: z.string(),
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

// tagのバリデーションスキーマ(フォーム用)
export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'タグ名を入力してください' })
    .max(100, { message: 'タグ名は100文字以内で入力してください' }),
});

export type Tag = z.infer<typeof tagSchema>;
export type TagFormData = z.infer<typeof tagFormSchema>;
