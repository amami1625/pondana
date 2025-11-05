import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardFormData, cardFormSchema } from '@/app/(protected)/cards/_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCardMutations } from './useCardMutations';

interface UseCardFormProps {
  card?: Card;
  bookId: number;
  cancel: () => void;
}

export const useCardForm = ({ card, bookId, cancel }: UseCardFormProps) => {
  const [error, setError] = useState('');
  const { createCard, updateCard, createError, updateError, isCreating, isUpdating } =
    useCardMutations();

  const defaultValues: CardFormData = {
    id: card?.id,
    book_id: card ? card.book_id : bookId,
    title: card ? card.title : '',
    content: card ? card.content : '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues,
  });

  const onSubmit = async (formData: CardFormData) => {
    setError('');

    if (card) {
      // 更新
      updateCard(formData, {
        onSuccess: () => {
          cancel();
        },
        onError: (error) => {
          setError(error.message);
        },
      });
    } else {
      // 作成
      createCard(formData, {
        onSuccess: () => {
          cancel();
        },
        onError: (error) => {
          setError(error.message);
        },
      });
    }
  };

  return {
    error: error || createError?.message || updateError?.message || '',
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isSubmitting || isCreating || isUpdating,
  };
};
