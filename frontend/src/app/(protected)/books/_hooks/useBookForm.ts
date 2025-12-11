import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookDetail, BookUpdateData, bookUpdateSchema } from '@/app/(protected)/books/_types';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';

interface UseBookFormProps {
  book: BookDetail;
  cancel: () => void;
}

export function useBookForm({ book, cancel }: UseBookFormProps) {
  const { updateBook, isUpdating } = useBookMutations();

  const defaultValues: BookUpdateData = {
    id: book.id,
    description: book?.description ?? undefined,
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
  } = useForm<BookUpdateData>({
    resolver: zodResolver(bookUpdateSchema),
    defaultValues,
  });

  const onSubmit = (data: BookUpdateData) => {
    updateBook({ ...data, id: book.id }, { onSuccess: () => cancel() });
  };

  return {
    register,
    control,
    setValue,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting: isUpdating,
  };
}
