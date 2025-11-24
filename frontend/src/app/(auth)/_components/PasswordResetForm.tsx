'use client';

import { Check } from 'lucide-react';
import { usePasswordResetForm } from '@/app/(auth)/_hooks/usePasswordResetForm';
import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';

export default function PasswordResetForm() {
  const { router, isComplete, register, handleSubmit, errors, isSubmitting, onSubmit } =
    usePasswordResetForm();

  if (isComplete) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">パスワードを変更しました</h2>
            <p className="text-gray-600">新しいパスワードでログインできるようになりました。</p>
          </div>
          <div className="mt-6 flex justify-center">
            <Button type="button" variant="submit" onClick={() => router.push('/settings')}>
              設定画面に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">新しいパスワードを設定</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            name="password"
            label="新しいパスワード"
            type="password"
            placeholder="新しいパスワードを入力"
            error={errors.password?.message}
            register={register}
          />
          <FormInput
            name="confirmPassword"
            label="パスワード（確認）"
            type="password"
            placeholder="パスワードを再入力"
            error={errors.confirmPassword?.message}
            register={register}
          />
          <p className="text-sm text-gray-500">
            パスワードは8文字以上で、英字と数字を含める必要があります。
          </p>
          <div className="flex justify-end">
            <Button type="submit" variant="submit" disabled={isSubmitting} loadingLabel="変更中...">
              パスワードを変更
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
