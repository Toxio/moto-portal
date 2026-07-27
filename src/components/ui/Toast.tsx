import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'animate-fade-in bg-accent fixed right-6 bottom-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg',
      )}
    >
      {message}
    </div>
  );
}
