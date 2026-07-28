import { useEffect, useState } from 'react';
import type { JournalModel } from '@/lib/types';
import { delay, getFromStorage, setToStorage } from '@/lib/utils';
import { mockJournalModels } from '@/mocks/journal';

const FAVORITES_KEY = 'la-moto-favorites';

export function useJournal() {
  const [models, setModels] = useState<JournalModel[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(300).then(() => {
      setModels(mockJournalModels);
      setFavorites(getFromStorage(FAVORITES_KEY, [] as string[]));
      setLoading(false);
    });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      setToStorage(FAVORITES_KEY, next);
      return next;
    });
  };

  return { models, favorites, loading, toggleFavorite };
}

export function useJournalModel(id: string) {
  const [model, setModel] = useState<JournalModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(200).then(() => {
      setModel(mockJournalModels.find((m) => m.id === id) ?? null);
      setLoading(false);
    });
  }, [id]);

  return { model, loading };
}
