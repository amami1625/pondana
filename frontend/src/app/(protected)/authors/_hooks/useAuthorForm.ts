import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Author, AuthorFormData, authorFormSchema } from '@/app/(protected)/authors/_types';
import { useAuthorMutations } from './useAuthorMutations';

interface UseAuthorFormProps {
  author?: Author;
  cancel: () => void;
}

export const useAuthorForm = ({ author, cancel }: UseAuthorFormProps) => {
  const [error, setError] = useState('');
  const { createAuthor, updateAuthor, createError, updateError } = useAuthorMutations();

  const defaultValues: AuthorFormData = {
    id: author?.id,
    name: author?.name ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: AuthorFormData) => {
    try {
      if (author) {
        // 更新
        updateAuthor(
          { id: author.id, name: data.name },
          {
            onSuccess: () => {
              cancel();
            },
            onError: (error) => {
              setError(error.message);
            },
          },
        );
      } else {
        // 作成
        createAuthor(
          { name: data.name },
          {
            onSuccess: () => {
              cancel();
            },
            onError: (error) => {
              setError(error.message);
            },
          },
        );
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    }
  };

  return {
    error: error || createError?.message || updateError?.message,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
};
