import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useJournal } from '@/hooks/useJournal';

const TYPES = [
  { value: '', label: 'Все типы' },
  { value: 'sport', label: 'Спорт' },
  { value: 'chopper', label: 'Чоппер' },
  { value: 'touring', label: 'Турист' },
  { value: 'cruiser', label: 'Круизер' },
  { value: 'enduro', label: 'Эндuro' },
  { value: 'retro', label: 'Ретро' },
];

export function JournalModelsTab() {
  const { models, favorites, loading, toggleFavorite } = useJournal();
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const brands = [...new Set(models.map((m) => m.brand))];

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (showFavorites && !favorites.includes(m.id)) return false;
      if (brand && m.brand !== brand) return false;
      if (type && m.type !== type) return false;
      if (minVolume && m.engineVolume < Number(minVolume)) return false;
      return true;
    });
  }, [models, brand, type, minVolume, showFavorites, favorites]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
        <Button
          variant={showFavorites ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          ❤️ Избранное ({favorites.length})
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Select
          options={[
            { value: '', label: 'Все бренды' },
            ...brands.map((b) => ({ value: b, label: b })),
          ]}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <Select options={TYPES} value={type} onChange={(e) => setType(e.target.value)} />
        <Input
          type="number"
          placeholder="Мин. объём см³"
          value={minVolume}
          onChange={(e) => setMinVolume(e.target.value)}
          className="w-40"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
          : filtered.map((model) => (
              <Card key={model.id} className="overflow-hidden p-0">
                <Link to={`/journal/${model.id}`}>
                  <img
                    src={model.imageUrl}
                    alt={`${model.brand} ${model.model}`}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <Link to={`/journal/${model.id}`}>
                      <h2 className="font-semibold">
                        {model.brand} {model.model}
                      </h2>
                    </Link>
                    <button onClick={() => toggleFavorite(model.id)} className="text-lg">
                      {favorites.includes(model.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p className="text-muted text-sm">
                    {model.engineVolume} см³ · {model.power} л.с. · {model.country}
                  </p>
                </div>
              </Card>
            ))}
      </div>
    </>
  );
}
