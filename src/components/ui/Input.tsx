import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'bg-secondary/50 placeholder:text-muted focus:border-accent focus:ring-accent w-full rounded-lg border border-white/10 px-4 py-2.5 text-white transition outline-none focus:ring-1',
        className,
      )}
      {...props}
    />
  );
}
