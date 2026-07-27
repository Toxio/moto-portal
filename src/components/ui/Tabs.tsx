import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition',
            active === tab.id
              ? 'bg-accent text-white'
              : 'text-muted hover:bg-white/5 hover:text-white',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
