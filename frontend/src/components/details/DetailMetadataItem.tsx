interface DetailMetadataItemProps {
  label: string;
  value: string | number;
}

export default function DetailMetadataItem({ label, value }: DetailMetadataItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
