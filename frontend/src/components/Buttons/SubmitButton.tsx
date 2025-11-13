import BaseButton from './BaseButton';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  disabled?: boolean;
}

export default function SubmitButton({
  label,
  loadingLabel = '送信中...',
  disabled = false
}: SubmitButtonProps) {
  return (
    <BaseButton type="submit" variant="submit" disabled={disabled}>
      {disabled ? loadingLabel : label}
    </BaseButton>
  );
}
