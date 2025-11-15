import { Unlock, Lock } from 'lucide-react';
import BookBadge from './BookBadge';

interface PublicBadgeProps {
  isPublic: boolean;
}

export default function PublicBadge({ isPublic }: PublicBadgeProps) {
  return (
    <BookBadge
      icon={isPublic ? <Unlock size={16} /> : <Lock size={16} />}
      label={isPublic ? '公開' : '非公開'}
      variant={isPublic ? 'public' : 'private'}
    />
  );
}
