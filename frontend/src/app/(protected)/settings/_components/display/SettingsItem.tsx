interface SettingsItemProps {
  label: string;
  value: string | number;
  isLast?: boolean;
}

export default function SettingsItem({ label, value, isLast = false }: SettingsItemProps) {
  return (
    <div className={isLast ? '' : 'border-b border-gray-100 pb-4'}>
      <dt className="mb-1 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-base text-gray-900">{value}</dd>
    </div>
  );
}
