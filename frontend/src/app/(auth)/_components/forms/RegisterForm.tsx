'use client';

import AuthInput from '@/app/(auth)/_components/forms/AuthInput';
import GoogleLoginButton from '@/app/(auth)/_components/GoogleLoginButton';
import { useRegisterForm } from '@/app/(auth)/_hooks/useRegisterForm';
import { RegisterFormData } from '@/schemas/auth';

export default function RegisterForm() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useRegisterForm();

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
          <AuthInput<RegisterFormData>
            name="name"
            label="ユーザー名"
            type="text"
            placeholder="ユーザー名を入力"
            register={register}
            error={errors.name?.message}
          />
          <AuthInput<RegisterFormData>
            name="email"
            label="メールアドレス"
            type="email"
            placeholder="example@email.com"
            register={register}
            error={errors.email?.message}
          />
          <AuthInput<RegisterFormData>
            name="password"
            label="パスワード"
            type="password"
            placeholder="8文字以上で入力"
            register={register}
            error={errors.password?.message}
          />
          <AuthInput<RegisterFormData>
            name="passwordConfirmation"
            label="パスワード確認"
            type="password"
            placeholder="パスワードを再入力"
            register={register}
            error={errors.passwordConfirmation?.message}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-md shadow-sky-200 transition-all hover:-translate-y-0.5 cursor-pointer disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
        >
          {isSubmitting ? '登録中...' : '登録'}
        </button>
      </form>
    </div>
  );
}
