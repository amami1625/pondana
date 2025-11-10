'use client';

import { User } from '@/schemas/user';
import { useProfileForm } from '@/app/(protected)/settings/_hooks/useProfileForm';
import FormInput from '@/components/forms/FormInput';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface NameFormProps {
  user: User;
  onClose: () => void;
}

export default function NameForm({ user, onClose }: NameFormProps) {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useProfileForm({
    user,
    cancel: onClose,
  });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
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
