interface ModalInfoProps {
  label: string;
  content: string;
}

export default function ModalInfo({ label, content }: ModalInfoProps) {
  return (
    <div className="mb-4 rounded-lg bg-gray-50 p-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900">{content}</p>
    </div>
  );
}
