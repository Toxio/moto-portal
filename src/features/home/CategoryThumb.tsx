import type { BikeCategory } from '@/lib/types';
import { mockCategoryImage } from '@/mocks/images';
import { cn } from '@/lib/utils';

interface CategoryThumbProps {
  category: BikeCategory;
  className?: string;
}

export function CategoryThumb({ category, className }: CategoryThumbProps) {
  return (
    <div
      className={cn(
        'group-hover:ring-accent/45 relative aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 ring-white/10 transition',
        className,
      )}
    >
      <img
        src={mockCategoryImage(category)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
    </div>
  );
}
