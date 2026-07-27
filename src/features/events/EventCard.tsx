import { Link } from 'react-router-dom';
import type { MotoEvent } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface EventCardProps {
  event: MotoEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link to="/events">
      <Card className="group overflow-hidden p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <Badge variant="source" className="absolute top-2 right-2 capitalize">
            {event.source}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="mb-1 line-clamp-2 font-semibold">{event.title}</h3>
          <p className="text-accent mb-2 text-sm font-medium">{formatDate(event.date)}</p>
          <p className="text-muted line-clamp-1 text-xs">
            {event.location}, {event.city}
          </p>
        </div>
      </Card>
    </Link>
  );
}
