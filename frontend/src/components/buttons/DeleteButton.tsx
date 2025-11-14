import BaseButton from '@/components/buttons/BaseButton';

interface DeleteButtonProps {
  onClick: () => void;
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <BaseButton variant="delete" onClick={onClick}>
      削除
    </BaseButton>
  );
}
