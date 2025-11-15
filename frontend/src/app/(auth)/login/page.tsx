'use client';

import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';
import ErrorMessage from '@/components/ErrorMessage';
import AuthLayout from '@/app/(auth)/_components/AuthLayout';
import { useLoginForm } from '@/app/(auth)/_hooks/useLoginForm';

export default function LoginPage() {
  const { register, handleSubmit, errors, error, loading, onSubmit } = useLoginForm();

  return (
    <AuthLayout title="ログイン" alternativeText="新規登録" alternativeHref="/register">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
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
        </div>

        {error && <ErrorMessage message={error} />}

        <div>
          <Button type="submit" variant="submit" disabled={loading} loadingLabel="ログイン中...">
            ログイン
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
