import { DeleteButton, UpdateButton } from '@/components/buttons';

interface SettingsItemProps {
  label: string;
  value: string | number;
  isLast?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SettingsItem({
  label,
  value,
  isLast = false,
  onEdit,
  onDelete,
}: SettingsItemProps) {
  return (
    <div className={isLast ? '' : 'border-b border-gray-100 pb-4'}>
      <div className="flex items-center justify-between">
        <div>
          <dt className="mb-1 text-sm font-medium text-gray-500">{label}</dt>
          <dd className="text-base text-gray-900">{value}</dd>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && <UpdateButton onClick={onEdit} />}
            {onDelete && <DeleteButton onClick={onDelete} />}
          </div>
        )}
      </div>
    </div>
  );
}
