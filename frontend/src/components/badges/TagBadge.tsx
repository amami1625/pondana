import { Hash } from 'lucide-react';
import BaseBadge from './BaseBadge';

interface TagBadgeProps {
  label: string;
}

export default function TagBadge({ label }: TagBadgeProps) {
  return <BaseBadge icon={<Hash size={16} />} label={label} variant="tag" />;
}
