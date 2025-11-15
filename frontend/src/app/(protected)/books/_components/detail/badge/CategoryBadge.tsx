import { Tag } from 'lucide-react';
import BookBadge from './BookBadge';

interface CategoryBadgeProps {
  label: string;
}

export default function CategoryBadge({ label }: CategoryBadgeProps) {
  return <BookBadge icon={<Tag size={16} />} label={label} variant="category" />;
}
