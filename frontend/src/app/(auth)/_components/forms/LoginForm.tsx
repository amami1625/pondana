'use client';

import { useLoginForm } from '@/app/(auth)/_hooks/useLoginForm';
import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';
import ErrorMessage from '@/components/ErrorMessage';

export default function LoginForm() {
  const { register, handleSubmit, errors, error, loading, onSubmit } = useLoginForm();
  return (
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
  );
}
