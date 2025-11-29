import { Unlock, Lock } from 'lucide-react';
import BaseBadge from './BaseBadge';

interface PublicBadgeProps {
  isPublic: boolean;
}

export default function PublicBadge({ isPublic }: PublicBadgeProps) {
  return (
    <BaseBadge
      icon={isPublic ? <Unlock size={16} /> : <Lock size={16} />}
      label={isPublic ? '公開' : '非公開'}
      variant={isPublic ? 'public' : 'private'}
    />
  );
}
