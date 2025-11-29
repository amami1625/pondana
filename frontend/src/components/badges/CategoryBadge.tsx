import { Tag } from 'lucide-react';
import BaseBadge from './BaseBadge';

interface CategoryBadgeProps {
  label: string;
}

export default function CategoryBadge({ label }: CategoryBadgeProps) {
  return <BaseBadge icon={<Tag size={16} />} label={label} variant="category" />;
}
