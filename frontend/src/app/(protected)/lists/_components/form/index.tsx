'use client';

import { List } from '@/app/(protected)/lists/_types';
import { useListForm } from '@/app/(protected)/lists/_hooks/useListForm';
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';
import FormCheckbox from '@/components/forms/FormCheckbox';
import Button from '@/components/buttons/Button';

interface ListFormProps {
  list?: List;
  submitLabel: string;
  cancel: () => void;
}

export default function ListForm({ list, submitLabel, cancel }: ListFormProps) {
  const { register, handleSubmit, errors, onSubmit, isSubmitting } = useListForm({
    list,
    cancel,
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      {/* リスト名 */}
      <FormInput
        name="name"
        label="リスト名"
        type="text"
        placeholder="リスト名を入力"
        error={errors.name?.message}
        register={register}
      />

      {/* 説明 */}
      <FormTextarea
        name="description"
        label="説明"
        placeholder="リストの説明やメモを入力"
        error={errors.description?.message}
        register={register}
      />

      {/* 公開・非公開 */}
      <FormCheckbox
        name="public"
        label="公開する"
        error={errors.public?.message}
        register={register}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="cancel" onClick={cancel}>
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loadingLabel={`${submitLabel}中...`}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
