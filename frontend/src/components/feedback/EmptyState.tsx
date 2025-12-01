import { getMessage, getIcon } from './EmptyState.helpers';

interface EmptyStateProps {
  element: '本' | 'リスト' | 'カード';
  context?: 'list' | 'detail';
}

export default function EmptyState({ element, context = 'list' }: EmptyStateProps) {
  const Icon = getIcon(element);
  const { title, description } = getMessage(element, context);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12">
      <Icon className="mb-4 h-12 w-12 text-gray-400" />
      <p className="mb-2 text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
