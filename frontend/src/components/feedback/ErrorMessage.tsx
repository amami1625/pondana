interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
        {message}
      </div>
    </div>
  );
}
