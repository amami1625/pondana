import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookDetail, BookFormData, bookFormSchema } from '@/app/(protected)/books/_types';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';

interface UseBookFormProps {
  book?: BookDetail;
  cancel: () => void;
}

export function useBookForm({ book, cancel }: UseBookFormProps) {
  const { createBook, updateBook, isCreating, isUpdating } = useBookMutations();

  const defaultValues: BookFormData = {
    title: book?.title ?? '',
    description: book?.description ?? '',
    author_ids: book?.authors.map((author) => author.id) ?? [],
    category_id: book?.category?.id ?? undefined,
    tag_ids: book?.tags.map((tag) => tag.id) ?? [],
    rating: book?.rating ?? undefined,
    reading_status: book?.reading_status ?? 'unread',
    public: book ? book.public : false,
  };

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues,
  });

  const onSubmit = (data: BookFormData) => {
    if (book) {
      // 更新
      updateBook(
        {
          ...data,
          id: book.id,
        },
        {
          onSuccess: () => cancel(),
        },
      );
    } else {
      // 作成
      createBook(data, {
        onSuccess: () => cancel(),
      });
    }
  };

  return {
    register,
    control,
    setValue,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting: isCreating || isUpdating,
  };
}
