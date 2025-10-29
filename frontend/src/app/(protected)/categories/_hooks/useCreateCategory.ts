import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Category,
  CategoryFormData,
  categoryFormSchema,
} from '@/app/(protected)/categories/_types';

interface UseCreateCategoryProps {
  category?: Category;
  action: (formData: CategoryFormData) => Promise<Category | { error: string }>;
  cancel: () => void;
  setCreatedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export const useCreateCategory = ({
  category,
  action,
  cancel,
  setCreatedCategories,
}: UseCreateCategoryProps) => {
  const [error, setError] = useState('');

  const defaultValues: CategoryFormData = {
    id: category?.id,
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
    const result = await action(data);
    if ('error' in result) {
      setError(result.error);
      return;
    }

    // 作成モードの場合は追加、編集モードの場合は更新
    if (!category) {
      setCreatedCategories((prev) => [...prev, result]);
    } else {
      setCreatedCategories((prev) => prev.map((cat) => (cat.id === result.id ? result : cat)));
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
