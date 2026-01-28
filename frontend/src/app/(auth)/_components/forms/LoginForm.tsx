'use client';

import AuthInput from '@/app/(auth)/_components/forms/AuthInput';
import GoogleLoginButton from '@/app/(auth)/_components/GoogleLoginButton';
import { useLoginForm } from '@/app/(auth)/_hooks/useLoginForm';
import { LoginFormData } from '@/schemas/auth';

export default function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLoginForm();

  return (
    <div className="space-y-5">
      <GoogleLoginButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">または</span>
        </div>
      </div>

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
          className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md shadow-sky-200 transition-all hover:-translate-y-0.5 cursor-pointer disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
