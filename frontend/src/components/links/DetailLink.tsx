import { ChevronRight } from 'lucide-react';
import BaseLink from './BaseLink';

interface DetailLinkProps {
  href: string;
}

export default function DetailLink({ href }: DetailLinkProps) {
  return (
    <BaseLink href={href} icon={<ChevronRight className="h-4 w-4" />}>
      詳細
    </BaseLink>
  );
}
