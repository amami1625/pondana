'use client';

import { Card } from '@/app/(protected)/cards/_types';
import { useCardForm } from '@/app/(protected)/cards/_hooks/useCardForm';
import { useStatuses } from '@/app/(protected)/statuses/_hooks/useStatuses';
import Button from '@/components/buttons/Button';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import FormSelect from '@/components/forms/FormSelect';

interface CardFormProps {
  card?: Card;
  bookId: string;
  submitLabel: string;
  onClose: () => void;
}

export default function CardForm({ card, bookId, onClose, submitLabel }: CardFormProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useCardForm({
    card,
    cancel: onClose,
    bookId,
  });
  const { data: statuses } = useStatuses();

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

      {/* ステータス */}
      <FormSelect
        name="status_id"
        label="ステータス"
        options={(statuses || []).map((s) => ({ value: s.id, label: s.name }))}
        defaultValue=""
        defaultLabel="ステータスなし"
        error={errors.status_id?.message}
        register={register}
        registerOptions={{
          setValueAs: (v) => (v === '' ? undefined : Number(v)),
        }}
      />

      <div className="flex justify-end gap-3">
        <Button variant="cancel" onClick={onClose}>
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loadingLabel={`${submitLabel}中...`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
