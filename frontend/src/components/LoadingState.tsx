interface LoadingStateProps {
  message?: string;
  variant?: 'card' | 'simple';
  showSpinner?: boolean;
  className?: string;
}

export default function LoadingState({
  message = '読み込み中...',
  variant = 'card',
  showSpinner = true,
  className = '',
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {showSpinner && (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      )}
      <p className="text-center text-gray-500">{message}</p>
    </div>
  );

  if (variant === 'simple') {
    return <div className={`py-12 ${className}`}>{content}</div>;
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {content}
    </div>
  );
}
