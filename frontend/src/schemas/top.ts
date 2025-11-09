import { z } from 'zod';
import { userSchema } from './user';
import { bookSchema } from './book';
import { listSchema } from './list';
import { cardSchema } from './card';

// トップページデータのバリデーションスキーマ
export const topPageSchema = z.object({
  profile: userSchema,
  recent_books: z.array(bookSchema).max(5),
  recent_lists: z.array(listSchema).max(5),
  recent_cards: z
    .array(
      cardSchema.extend({
        book: z.object({
          title: z.string(),
        }),
      }),
    )
    .max(5),
});

export type TopPageData = z.infer<typeof topPageSchema>;
