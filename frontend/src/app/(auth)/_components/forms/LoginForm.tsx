'use client';

import AuthInput from '@/app/(auth)/_components/forms/AuthInput';
import { useLoginForm } from '@/app/(auth)/_hooks/useLoginForm';
import { LoginFormData } from '@/schemas/auth';

export default function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLoginForm();

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <AuthInput<LoginFormData>
          name="email"
          label="メールアドレス"
          type="email"
          placeholder="example@email.com"
          register={register}
          error={errors.email?.message}
        />
        <AuthInput<LoginFormData>
          name="password"
          label="パスワード"
          type="password"
          placeholder="パスワードを入力"
          register={register}
          error={errors.password?.message}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md shadow-sky-200 transition-all hover:-translate-y-0.5 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
