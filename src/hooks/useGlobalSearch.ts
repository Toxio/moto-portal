import { useMemo } from 'react';
import type { SearchResult } from '@/lib/types';
import { mockEvents } from '@/mocks/events';
import { mockEncyclopedia } from '@/mocks/encyclopedia';
import { mockForumThreads } from '@/mocks/forum';
import { mockListings } from '@/mocks/listings';

export function useGlobalSearch(query: string): SearchResult[] {
  return useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const listingResults: SearchResult[] = mockListings
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.brand?.toLowerCase().includes(q),
      )
      .map((l) => ({
        id: l.id,
        type: 'listing' as const,
        title: l.title,
        subtitle: l.city,
        url: `/listings/${l.id}`,
      }));

    const eventResults: SearchResult[] = mockEvents
      .filter((e) => e.title.toLowerCase().includes(q))
      .map((e) => ({
        id: e.id,
        type: 'event' as const,
        title: e.title,
        subtitle: e.city,
        url: '/events',
      }));

    const encyclopediaResults: SearchResult[] = mockEncyclopedia
      .filter((m) => m.brand.toLowerCase().includes(q) || m.model.toLowerCase().includes(q))
      .map((m) => ({
        id: m.id,
        type: 'encyclopedia' as const,
        title: `${m.brand} ${m.model}`,
        subtitle: m.country,
        url: `/encyclopedia/${m.id}`,
      }));

    const forumResults: SearchResult[] = mockForumThreads
      .filter((t) => t.title.toLowerCase().includes(q))
      .map((t) => ({
        id: t.id,
        type: 'forum' as const,
        title: t.title,
        subtitle: t.author,
        url: `/forum/${t.categoryId}/${t.id}`,
      }));

    return [...listingResults, ...eventResults, ...encyclopediaResults, ...forumResults];
  }, [query]);
}
