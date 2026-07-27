import { useEffect, useState } from 'react';
import type { Listing } from '@/lib/types';
import { delay } from '@/lib/utils';
import { mockListings } from '@/mocks/listings';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(300).then(() => {
      setListings(mockListings);
      setLoading(false);
    });
  }, []);

  return { listings, loading, setListings };
}

export function useListing(id: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(200).then(() => {
      setListing(mockListings.find((l) => l.id === id) ?? null);
      setLoading(false);
    });
  }, [id]);

  return { listing, loading };
}
