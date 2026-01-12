import { Check } from 'lucide-react';
import Button from '@/components/buttons/Button';
import FormInput from '@/components/forms/FormInput';
import { useEmailChange } from '@/app/(protected)/settings/_hooks/useEmailChange';

interface EmailChangeFormProps {
  currentEmail: string;
  onClose: () => void;
}

export default function EmailChangeForm({ currentEmail, onClose }: EmailChangeFormProps) {
  const { isSent, newEmail, register, handleSubmit, errors, isSubmitting, onSubmit } =
    useEmailChange();

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {isSent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-700">確認メールを送信しました。</p>
          <p className="mt-2 text-sm text-gray-500">
            新しいメールアドレス（{newEmail}
            ）に確認メールを送信しました。メール内のリンクをクリックして、変更を完了してください。
          </p>
          <p className="mt-4 text-sm font-medium text-amber-600">
            セキュリティのため自動的にログアウトします。
            <br />
            メールアドレス変更完了後、新しいメールアドレスでログインしてください。
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              <p>
                現在のメールアドレス: <span className="font-medium">{currentEmail}</span>
              </p>
            </div>
            <FormInput
              name="email"
              label="新しいメールアドレス"
              type="email"
              placeholder="新しいメールアドレスを入力"
              error={errors.email?.message}
              register={register}
            />
            <p className="text-sm text-gray-500">
              新しいメールアドレスに確認メールを送信します。メール内のリンクをクリックすると変更が完了します。
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loadingLabel="送信中..."
            >
              確認メールを送信
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
