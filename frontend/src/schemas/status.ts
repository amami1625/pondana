import { z } from 'zod';

// statusのバリデーションスキーマ(APIレスポンス用)
export const statusSchema = z.object({
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

// statusのバリデーションスキーマ(フォーム用)
export const statusFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'ステータス名を入力してください' })
    .max(50, { message: 'ステータス名は50文字以内で入力してください' }),
});

export type Status = z.infer<typeof statusSchema>;
export type StatusFormData = z.infer<typeof statusFormSchema>;
