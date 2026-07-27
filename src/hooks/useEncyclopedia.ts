import { useEffect, useState } from 'react';
import type { EncyclopediaModel } from '@/lib/types';
import { delay, getFromStorage, setToStorage } from '@/lib/utils';
import { mockEncyclopedia } from '@/mocks/encyclopedia';

const FAVORITES_KEY = 'la-moto-favorites';

export function useEncyclopedia() {
  const [models, setModels] = useState<EncyclopediaModel[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(300).then(() => {
      setModels(mockEncyclopedia);
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

export function useEncyclopediaModel(id: string) {
  const [model, setModel] = useState<EncyclopediaModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay(200).then(() => {
      setModel(mockEncyclopedia.find((m) => m.id === id) ?? null);
      setLoading(false);
    });
  }, [id]);

  return { model, loading };
}
