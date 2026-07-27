import { useEffect, useState } from 'react';
import type { BikerOnMap } from '@/lib/types';
import { delay } from '@/lib/utils';
import { mockBikers } from '@/mocks/map';

export function useMapBikers() {
  const [bikers, setBikers] = useState<BikerOnMap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(300).then(() => {
      setBikers(mockBikers);
      setLoading(false);
    });
  }, []);

  return { bikers, loading };
}
