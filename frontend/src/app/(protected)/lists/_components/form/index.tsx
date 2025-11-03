import { List } from '@/app/(protected)/lists/_types';
import { useListFormState } from '@/app/(protected)/lists/_hooks/useListFormState';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import FormCheckbox from '@/components/forms/FormCheckbox';
import ErrorMessage from '@/components/ErrorMessage';
import CancelButton from '@/components/Buttons/CancelButton';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface ListFormProps {
  list?: List;
  submitLabel: string;
  cancel: () => void;
}

export default function ListForm({ list, submitLabel, cancel }: ListFormProps) {
  const { register, handleSubmit, errors, error, onSubmit, isSubmitting } = useListFormState({
    list,
    cancel,
  });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      {list && (
        <FormInput
          name="id"
          type="hidden"
          register={register}
          registerOptions={{ valueAsNumber: true }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* リスト名 */}
        <FormInput
          name="name"
          label="リスト名"
          type="text"
          placeholder="リスト名を入力"
          error={errors.name?.message}
          register={register}
        />
      </div>

      {/* 説明 */}
      <FormTextarea
        name="description"
        label="説明"
        placeholder="リストの説明やメモを入力"
        error={errors.description?.message}
        register={register}
      />

      {/* 公開・非公開 */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormCheckbox
          name="public"
          label="公開する"
          error={errors.public?.message}
          register={register}
        />
      </div>

      {/* エラーメッセージ */}
      {error && <ErrorMessage message={error} />}

      <div className="flex justify-end gap-3">
        <CancelButton onClick={cancel} />
        <SubmitButton label={submitLabel} disabled={isSubmitting} />
      </div>
    </form>
  );
}
