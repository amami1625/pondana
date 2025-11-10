'use client';

import { Category } from '@/app/(protected)/categories/_types';
import { useCategoryForm } from '@/app/(protected)/categories/_hooks/useCategoryForm';
import FormInput from '@/components/forms/FormInput';
import CancelButton from '@/components/Buttons/CancelButton';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface CategoryFormProps {
  category?: Category;
  submitLabel: string;
  cancel: () => void;
}

export default function CategoryForm({ category, submitLabel, cancel }: CategoryFormProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useCategoryForm({
    category,
    cancel,
  });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          name="name"
          label="カテゴリ名"
          placeholder="カテゴリ名を入力"
          error={errors.name?.message}
          register={register}
        />
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={cancel} />
        <SubmitButton label={submitLabel} disabled={isSubmitting} />
      </div>
    </form>
  );
}
