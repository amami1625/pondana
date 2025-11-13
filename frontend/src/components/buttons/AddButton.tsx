import BaseButton from '@/components/buttons/BaseButton';

interface AddButtonProps {
  onClick: () => void;
  isAdded?: boolean;
}

export default function AddButton({ onClick, isAdded }: AddButtonProps) {
  return (
    <BaseButton variant="add" onClick={onClick} disabled={isAdded}>
      {isAdded ? '追加済み' : '追加'}
    </BaseButton>
  );
}
