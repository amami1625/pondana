import { StickyNote } from 'lucide-react';
import BaseButton from './BaseButton';

interface CreateCardButtonProps {
  onClick: () => void;
}

export default function CreateCardButton({ onClick }: CreateCardButtonProps) {
  return (
    <BaseButton variant="create" onClick={onClick} icon={<StickyNote className="h-4 w-4" />}>
      カードを作成
    </BaseButton>
  );
}
