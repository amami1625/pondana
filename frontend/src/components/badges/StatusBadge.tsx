import BaseBadge from '@/components/badges/BaseBadge';
import { CircleCheckBig } from 'lucide-react';

interface StatusBadgeProps {
  label: string;
}

export default function StatusBadge({ label }: StatusBadgeProps) {
  return <BaseBadge icon={<CircleCheckBig size={16} />} label={label} variant="status" />;
}
