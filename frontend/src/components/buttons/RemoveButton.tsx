import BaseButton from '@/components/buttons/BaseButton';

interface RemoveButtonProps {
  onClick: () => void;
}

export default function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <BaseButton variant="remove" onClick={onClick}>
      このリストから外す
    </BaseButton>
  );
}
