import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  supabase_uid: z.string(),
  name: z.string(),
  avatar_url: z.string().nullable(),
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

// Userのバリデーションスキーマ(フォーム用)
export const userFormSchema = z.object({
  name: z.string().min(1, { message: 'ユーザー名を入力してください' }),
  avatar_url: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
