import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Category,
  CategoryFormData,
  categoryFormSchema,
} from '@/app/(protected)/categories/_types';
import { useCategoryMutations } from '@/app/(protected)/categories/_hooks/useCategoryMutations';

interface UseCategoryFormProps {
  category?: Category;
  cancel: () => void;
}

export const useCategoryForm = ({ category, cancel }: UseCategoryFormProps) => {
  const [error, setError] = useState('');
  const { createCategory, updateCategory, createError, updateError } = useCategoryMutations();

  const defaultValues: CategoryFormData = {
    name: category?.name ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        // 更新
        updateCategory(
          { ...data, id: category.id },
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
        createCategory(data, {
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
