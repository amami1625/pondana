import { Plus } from 'lucide-react';
import BaseButton from './BaseButton';

interface CreateButtonProps {
  onClick: () => void;
}

export default function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <BaseButton variant="create" onClick={onClick} icon={<Plus className="h-4 w-4" />}>
      新規作成
    </BaseButton>
  );
}
