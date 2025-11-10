import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Author, AuthorFormData, authorFormSchema } from '@/app/(protected)/authors/_types';
import { useAuthorMutations } from '@/app/(protected)/authors/_hooks/useAuthorMutations';

interface UseAuthorFormProps {
  author?: Author;
  cancel: () => void;
}

export const useAuthorForm = ({ author, cancel }: UseAuthorFormProps) => {
  const { createAuthor, updateAuthor, isCreating, isUpdating } = useAuthorMutations();

  const defaultValues: AuthorFormData = {
    name: author?.name ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: AuthorFormData) => {
    if (author) {
      // 更新
      updateAuthor(
        { ...data, id: author.id },
        {
          onSuccess: () => cancel(),
          onError: (error) => toast.error(error.message),
        },
      );
    } else {
      // 作成
      createAuthor(data, {
        onSuccess: () => cancel(),
        onError: (error) => toast.error(error.message),
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isCreating || isUpdating,
  };
};
