import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Status, StatusFormData, statusFormSchema } from '@/app/(protected)/statuses/_types';
import { useStatusMutations } from '@/app/(protected)/statuses/_hooks/useStatusMutations';

interface UseStatusFormProps {
  status?: Status;
  cancel: () => void;
}

export const useStatusForm = ({ status, cancel }: UseStatusFormProps) => {
  const { createStatus, updateStatus, isCreating, isUpdating } = useStatusMutations();

  const defaultValues: StatusFormData = {
    name: status?.name ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: StatusFormData) => {
    if (status) {
      // 更新
      updateStatus(
        { id: status.id, ...data },
        {
          onSuccess: () => cancel(),
        },
      );
    } else {
      // 作成
      createStatus(data, {
        onSuccess: () => cancel(),
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isCreating || isUpdating,
  };
};
