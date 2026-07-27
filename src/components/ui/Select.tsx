import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'bg-secondary/50 focus:border-accent rounded-lg border border-white/10 px-3 py-2 text-sm text-white outline-none',
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-secondary">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
