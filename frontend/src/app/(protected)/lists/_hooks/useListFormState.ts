import { useState } from 'react';
import { List, ListFormData, listFormSchema } from '../_types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useListMutations } from './useListMutations';

interface UseListFormStateProps {
  list?: List;
  cancel: () => void;
}

export function useListFormState({ list, cancel }: UseListFormStateProps) {
  const [error, setError] = useState('');
  const { createList, updateList, createError, updateError, isCreating, isUpdating } =
    useListMutations();

  const defaultValues: ListFormData = {
    id: list?.id,
    name: list?.name ?? '',
    description: list?.description ?? '',
    public: list?.public ?? false,
  };

  const onSubmit = (data: ListFormData) => {
    try {
      setError(''); // 前回のエラーをクリア

      if (list) {
        // 更新
        updateList(
          {
            id: list.id,
            name: data.name,
            description: data.description,
            public: data.public,
          },
          {
            onSuccess: () => cancel(),
            onError: (error) => setError(error.message),
          },
        );
      } else {
        // 作成
        createList(
          {
            name: data.name,
            description: data.description,
            public: data.public,
          },
          {
            onSuccess: () => cancel(),
            onError: (error) => setError(error.message),
          },
        );
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
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
    error: error || createError?.message || updateError?.message,
    onSubmit,
    isSubmitting: isCreating || isUpdating,
  };
}
