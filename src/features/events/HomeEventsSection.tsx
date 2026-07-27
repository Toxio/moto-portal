import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '@/features/events/EventCard';
import { useEvents } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomeEventsSection() {
  const { events, loading } = useEvents();

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => !e.isPast)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Мотособытия</h2>
        <Link to="/events" className="text-accent text-sm hover:underline">
          Все события →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
          : upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </section>
  );
}
