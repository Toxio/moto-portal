import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'source';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-white/10 text-white',
        variant === 'premium' && 'bg-accent/20 text-accent',
        variant === 'source' && 'bg-secondary text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
