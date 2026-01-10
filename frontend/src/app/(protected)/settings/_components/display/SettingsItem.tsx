import { Edit3, Trash2 } from 'lucide-react';

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
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="cursor-pointer hover:text-blue-600 transition-colors"
              >
                <Edit3 size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="cursor-pointer hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
