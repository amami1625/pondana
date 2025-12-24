import Breadcrumb from '@/components/layout/Breadcrumb';
import { BreadcrumbItem } from '@/constants/breadcrumbs';

interface DetailContainerProps {
  breadcrumbItems?: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function DetailContainer({ breadcrumbItems, children }: DetailContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* パンくずリスト */}
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

      {children}
    </div>
  );
}
