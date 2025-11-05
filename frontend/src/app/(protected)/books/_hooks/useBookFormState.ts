import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Book, BookFormData, bookFormSchema } from '@/app/(protected)/books/_types';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';

interface UseBookFormStateProps {
  book?: Book;
  cancel: () => void;
}

export function useBookFormState({ book, cancel }: UseBookFormStateProps) {
  const [error, setError] = useState('');
  const { createBook, updateBook, createError, updateError, isCreating, isUpdating } =
    useBookMutations();

  const defaultValues: BookFormData = {
    id: book?.id,
    title: book?.title ?? '',
    description: book?.description ?? '',
    author_ids: book?.authors.map((author) => author.id) ?? [],
    category_id: book?.category_id ?? 0,
    rating: book?.rating ?? 0,
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
    try {
      setError(''); // 前回のエラーをクリア

      if (book) {
        // 更新
        updateBook(
          {
            id: book.id,
            title: data.title,
            description: data.description,
            author_ids: data.author_ids,
            category_id: data.category_id,
            rating: data.rating,
            reading_status: data.reading_status,
            public: data.public,
          },
          {
            onSuccess: () => cancel(),
            onError: (error) => setError(error.message),
          },
        );
      } else {
        // 作成
        createBook(
          {
            title: data.title,
            description: data.description,
            author_ids: data.author_ids,
            category_id: data.category_id,
            rating: data.rating,
            reading_status: data.reading_status,
            public: data.public,
          },
          {
            onSuccess: () => cancel(),
            onError: (error) => setError(error.message),
          },
        );
      }
    } catch (_err) {
      setError('予期しないエラーが発生しました');
    }
  };

  return {
    register,
    control,
    setValue,
    handleSubmit,
    errors,
    error: error || createError?.message || updateError?.message,
    onSubmit,
    isSubmitting: isCreating || isUpdating,
  };
}
