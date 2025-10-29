'use client';

import { Category, CategoryFormData } from '@/app/(protected)/categories/_types';
import FormInput from '@/components/forms/FormInput';
import CancelButton from '@/components/Buttons/CancelButton';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/Buttons/SubmitButton';
import { useCreateCategory } from '@/app/(protected)/categories/_hooks/useCreateCategory';

interface CategoryFormProps {
  category?: Category;
  submitLabel: string;
  action: (formData: CategoryFormData) => Promise<Category | { error: string }>;
  cancel: () => void;
  setCreatedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function CategoryForm({
  category,
  submitLabel,
  action,
  cancel,
  setCreatedCategories,
}: CategoryFormProps) {
  const { error, register, handleSubmit, onSubmit, errors, isSubmitting } = useCreateCategory({
    category,
    action,
    cancel,
    setCreatedCategories,
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

      {/* エラーメッセージ */}
      {error && <ErrorMessage message={error} />}
    </form>
  );
}
