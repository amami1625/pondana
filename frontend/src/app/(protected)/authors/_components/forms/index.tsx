'use client';

import { AuthorFormData } from '@/schemas/author';
import { Author } from '@/app/(protected)/authors/_types';
import { useAuthorForm } from '@/app/(protected)/authors/_hooks/useAuthorForm';
import FormInput from '@/components/forms/FormInput';
import CancelButton from '@/components/Buttons/CancelButton';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface AuthorFormProps {
  author?: Author;
  submitLabel: string;
  action: (formData: AuthorFormData) => Promise<Author | { error: string }>;
  cancel: () => void;
  setCreatedAuthors: React.Dispatch<React.SetStateAction<Author[]>>;
}

export default function AuthorForm({
  author,
  submitLabel,
  action,
  cancel,
  setCreatedAuthors,
}: AuthorFormProps) {
  const { error, register, handleSubmit, onSubmit, errors, isSubmitting } = useAuthorForm({
    author,
    action,
    cancel,
    setCreatedAuthors,
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
        <CancelButton onClick={cancel} />
        <SubmitButton label={submitLabel} disabled={isSubmitting} />
      </div>

      {/* エラーメッセージ */}
      {error && <ErrorMessage message={error} />}
    </form>
  );
}
