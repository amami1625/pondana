import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { List, ListFormData, listFormSchema } from '@/app/(protected)/lists/_types';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';

interface UseListFormProps {
  list?: List;
  cancel: () => void;
}

export function useListForm({ list, cancel }: UseListFormProps) {
  const { createList, updateList, isCreating, isUpdating } = useListMutations();

  const defaultValues: ListFormData = {
    name: list?.name ?? '',
    description: list?.description ?? '',
    public: list?.public ?? false,
  };

  const onSubmit = (data: ListFormData) => {
    if (list) {
      // 更新
      updateList(
        {
          ...data,
          id: list.id,
        },
        {
          onSuccess: () => cancel(),
        },
      );
    } else {
      // 作成
      createList(data, {
        onSuccess: () => cancel(),
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListFormData>({
    resolver: zodResolver(listFormSchema),
    defaultValues,
  });

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting: isCreating || isUpdating,
  };
}
