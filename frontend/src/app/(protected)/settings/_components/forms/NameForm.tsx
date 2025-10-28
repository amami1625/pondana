'use client';

import FormInput from '@/components/forms/FormInput';
import { useUpdateUser } from '../../_hooks/useUpdateUser';
import { User, UserFormData } from '@/schemas/profile';
import ErrorMessage from '@/components/ErrorMessage';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface NameFormProps {
  user: User;
  action: (formData: UserFormData) => Promise<{ success: true } | { error: string }>;
  onClose: () => void;
}

export default function NameForm({ user, action, onClose }: NameFormProps) {
  const { register, handleSubmit, errors, error, isSubmitting, onSubmit } = useUpdateUser({
    user,
    action,
    onClose,
  });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        <FormInput
          name="name"
          label="ユーザー名"
          type="text"
          placeholder="新しいユーザー名を入力"
          error={errors.name?.message}
          register={register}
        />
      </div>

      <div className="flex justify-end gap-3">
        <SubmitButton label="更新" disabled={isSubmitting} />
      </div>
    </form>
  );
}
