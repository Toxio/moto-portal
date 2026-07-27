import { useEffect, useState } from 'react';
import type { MotoEvent } from '@/lib/types';
import { delay } from '@/lib/utils';
import { mockEvents } from '@/mocks/events';

export function useEvents() {
  const [events, setEvents] = useState<MotoEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(300).then(() => {
      setEvents(mockEvents);
      setLoading(false);
    });
  }, []);

  return { events, loading };
}
