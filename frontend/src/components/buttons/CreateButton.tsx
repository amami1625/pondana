'use client';

import { Plus } from 'lucide-react';
import BaseButton from './BaseButton';

interface CreateButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function CreateButton({ onClick, children }: CreateButtonProps) {
  return (
    <BaseButton variant="create" onClick={onClick} icon={<Plus className="h-4 w-4" />}>
      {children}
    </BaseButton>
  );
}
