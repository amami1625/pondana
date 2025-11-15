'use client';

import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';
import ErrorMessage from '@/components/ErrorMessage';
import AuthLayout from '@/app/(auth)/_components/AuthLayout';
import { useRegisterForm } from '@/app/(auth)/_hooks/useRegisterForm';

export default function RegisterPage() {
  const { register, handleSubmit, errors, error, loading, onSubmit } = useRegisterForm();

  return (
    <AuthLayout title="新規登録" alternativeText="ログイン" alternativeHref="/login">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormInput
            name="name"
            type="text"
            placeholder="ユーザー名"
            register={register}
            error={errors.name?.message}
          />
          <FormInput
            name="email"
            type="email"
            placeholder="メールアドレス"
            register={register}
            error={errors.email?.message}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="パスワード"
            register={register}
            error={errors.password?.message}
          />
          <FormInput
            name="passwordConfirmation"
            type="password"
            placeholder="パスワード確認"
            register={register}
            error={errors.passwordConfirmation?.message}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        <div>
          <Button type="submit" variant="submit" disabled={loading} loadingLabel="登録中...">
            登録
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
