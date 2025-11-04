export {
  type BookBase,
  type Book,
  type BookDetail,
  type BookFormData,
  bookBaseSchema,
  bookSchema,
  bookDetailSchema,
  bookFormSchema,
} from '@/schemas/book';

export type ReadingStatus = 'unread' | 'reading' | 'completed';
