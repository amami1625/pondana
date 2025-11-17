import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbItem } from '@/constants/breadcrumbs';

interface DetailContainerProps {
  breadcrumbItems: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function DetailContainer({ breadcrumbItems, children }: DetailContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* パンくずリスト */}
      <Breadcrumb items={breadcrumbItems} />

      {children}
    </div>
  );
}
