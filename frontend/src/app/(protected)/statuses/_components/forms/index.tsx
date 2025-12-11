import { Status } from '@/schemas/status';
import { useStatusForm } from '@/app/(protected)/statuses/_hooks/useStatusForm';
import FormInput from '@/components/forms/FormInput';
import Button from '@/components/buttons/Button';

interface StatusFormProps {
  status?: Status;
  submitLabel: string;
  cancel: () => void;
}

export default function StatusForm({ status, submitLabel, cancel }: StatusFormProps) {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } = useStatusForm({
    status,
    cancel,
  });

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          name="name"
          label="ステータス名"
          placeholder="ステータス名を入力"
          error={errors.name?.message}
          register={register}
        />
      </div>

      <div className="flex justify-end gap-3">
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
