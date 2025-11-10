import toast from 'react-hot-toast';
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
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategoryMutations();

  const defaultValues: CategoryFormData = {
    name: category?.name ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: CategoryFormData) => {
    if (category) {
      // 更新
      updateCategory(
        { ...data, id: category.id },
        {
          onSuccess: () => cancel(),
          onError: (error) => toast.error(error.message),
        },
      );
    } else {
      // 作成
      createCategory(data, {
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
