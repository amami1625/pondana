import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, TagFormData, tagFormSchema } from '../_types';
import { useTagMutations } from './useTagMutations';

interface UseTagFormProps {
  tag?: Tag;
  cancel: () => void;
}

export const useTagForm = ({ tag, cancel }: UseTagFormProps) => {
  const { createTag, isCreating } = useTagMutations();

  const defaultValues: TagFormData = {
    name: tag?.name ?? '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TagFormData) => {
    if (tag) {
      // 更新
      // TODO: 更新機能を実装する際に記述
    } else {
      // 作成
      createTag(data, {
        onSuccess: () => cancel(),
      });
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isCreating,
  };
};
