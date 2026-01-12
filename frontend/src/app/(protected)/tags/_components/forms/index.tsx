import { Tag } from '@/schemas/tag';
import { useTagForm } from '../../_hooks/useTagForm';
import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';

interface TagFormProps {
  tag?: Tag;
  submitLabel: string;
  cancel: () => void;
}

export default function TagForm({ tag, submitLabel, cancel }: TagFormProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useTagForm({ tag, cancel });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          name="name"
          label="タグ名"
          placeholder="タグ名を入力"
          error={errors.name?.message}
          register={register}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={cancel}>
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
