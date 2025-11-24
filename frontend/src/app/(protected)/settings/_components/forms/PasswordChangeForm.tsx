'use client';

import { Check } from 'lucide-react';
import Button from '@/components/buttons/Button';
import FormInput from '@/components/forms/FormInput';
import { usePasswordChange } from '@/app/(protected)/settings/_hooks/usePasswordChange';

interface PasswordChangeFormProps {
  email: string;
  onClose: () => void;
}

export default function PasswordChangeForm({ email, onClose }: PasswordChangeFormProps) {
  const { isSent, register, handleSubmit, errors, isSubmitting, onSubmit } = usePasswordChange();

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {isSent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-700">
            <span className="font-medium">{email}</span>
            <br />
            にパスワード変更用のメールを送信しました。
          </p>
          <p className="mt-2 text-sm text-gray-500">
            メール内のリンクをクリックして、新しいパスワードを設定してください。
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              パスワードを変更するには、現在のパスワードを入力してください。
            </p>
            <FormInput
              name="password"
              label="現在のパスワード"
              type="password"
              placeholder="現在のパスワードを入力"
              error={errors.password?.message}
              register={register}
            />
            <p className="text-sm text-gray-500">
              確認後、<span className="font-medium">{email}</span>{' '}
              にパスワード変更用のメールを送信します。
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="cancel" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" variant="submit" disabled={isSubmitting} loadingLabel="確認中...">
              メールを送信
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
