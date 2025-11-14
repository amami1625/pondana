import BaseButton from './BaseButton';

interface CancelButtonProps {
  onClick: () => void;
}

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <BaseButton variant="cancel" onClick={onClick}>
      キャンセル
    </BaseButton>
  );
}
