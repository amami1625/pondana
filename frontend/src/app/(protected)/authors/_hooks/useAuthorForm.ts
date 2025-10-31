import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Author, AuthorFormData, authorFormSchema } from '@/app/(protected)/authors/_types';

interface UseAuthorFormProps {
  author?: Author;
  action: (formData: AuthorFormData) => Promise<Author | { error: string }>;
  cancel: () => void;
  setCreatedAuthors: React.Dispatch<React.SetStateAction<Author[]>>;
}

export const useAuthorForm = ({
  author,
  action,
  cancel,
  setCreatedAuthors,
}: UseAuthorFormProps) => {
  const [error, setError] = useState('');

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
    const result = await action(data);
    if ('error' in result) {
      setError(result.error);
      return;
    }

    if (!author) {
      setCreatedAuthors((prev) => [...prev, result]);
    } else {
      setCreatedAuthors((prev) =>
        prev.map((author) => (author.id === result.id ? result : author)),
      );
    }
    cancel();
  };

  return {
    error,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
};
