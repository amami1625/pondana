import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardFormData, cardFormSchema } from '@/app/(protected)/cards/_types';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';

interface UseCardFormProps {
  card?: Card;
  bookId: string;
  cancel: () => void;
}

export const useCardForm = ({ card, bookId, cancel }: UseCardFormProps) => {
  const { createCard, updateCard, isCreating, isUpdating } = useCardMutations();

  const defaultValues: CardFormData = {
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

  const onSubmit = async (data: CardFormData) => {
    if (card) {
      // 更新
      updateCard(
        { ...data, id: card.id },
        {
          onSuccess: () => cancel(),
        },
      );
    } else {
      // 作成
      createCard(data, {
        onSuccess: () => cancel(),
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isSubmitting || isCreating || isUpdating,
  };
};
