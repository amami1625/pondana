import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface AuthInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  error?: string;
  register: UseFormRegister<T>;
}

export default function AuthInput<T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  error,
  register,
}: AuthInputProps<T>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
