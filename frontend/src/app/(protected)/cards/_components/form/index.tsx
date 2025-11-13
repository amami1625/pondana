'use client';

import { Card } from '@/app/(protected)/cards/_types';
import { useCardForm } from '@/app/(protected)/cards/_hooks/useCardForm';
import CancelButton from '@/components/Buttons/CancelButton';
import SubmitButton from '@/components/Buttons/SubmitButton';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';

interface CardFormProps {
  card?: Card;
  bookId: number;
  submitLabel: string;
  onClose: () => void;
}

export default function CardForm({ card, bookId, onClose, submitLabel }: CardFormProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useCardForm({
    card,
    cancel: onClose,
    bookId,
  });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* タイトル */}
        <FormInput
          name="title"
          label="タイトル"
          type="text"
          placeholder="タイトルを入力"
          error={errors.title?.message}
          register={register}
        />
      </div>

      {/* 本文 */}
      <FormTextarea
        name="content"
        label="本文"
        placeholder="カードの本文を入力"
        error={errors.content?.message}
        register={register}
      />

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onClose} />
        <SubmitButton
          label={submitLabel}
          loadingLabel={`${submitLabel}中...`}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
