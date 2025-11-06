import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Author, AuthorFormData, authorFormSchema } from '@/app/(protected)/authors/_types';
import { useAuthorMutations } from '@/app/(protected)/authors/_hooks/useAuthorMutations';

interface UseAuthorFormProps {
  author?: Author;
  cancel: () => void;
}

export const useAuthorForm = ({ author, cancel }: UseAuthorFormProps) => {
  const [error, setError] = useState('');
  const { createAuthor, updateAuthor, createError, updateError } = useAuthorMutations();

  const defaultValues: AuthorFormData = {
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
          { ...data, id: author.id },
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
        createAuthor(data, {
          onSuccess: () => {
            cancel();
          },
          onError: (error) => {
            setError(error.message);
          },
        });
      }
    } catch (_err) {
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
