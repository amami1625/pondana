'use client';

import { Author } from '@/app/(protected)/authors/_types';
import { useAuthorForm } from '@/app/(protected)/authors/_hooks/useAuthorForm';
import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';

interface AuthorFormProps {
  author?: Author;
  submitLabel: string;
  cancel: () => void;
}

export default function AuthorForm({ author, submitLabel, cancel }: AuthorFormProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useAuthorForm({
    author,
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
          label="著者名"
          placeholder="著者名を入力"
          error={errors.name?.message}
          register={register}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="cancel" onClick={cancel}>
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="submit"
          disabled={isSubmitting}
          loadingLabel={`${submitLabel}中...`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
