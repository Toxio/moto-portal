import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ListingCard } from '@/features/listings/ListingCard';
import { useJournal, useJournalModel } from '@/hooks/useJournal';
import { useListings } from '@/hooks/useListings';

export function JournalModelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { model, loading } = useJournalModel(id!);
  const { favorites, toggleFavorite } = useJournal();
  const { listings } = useListings();

  const related = listings.filter(
    (l) => l.type === 'motorcycle' && (l.brand === model?.brand || l.model === model?.model),
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="aspect-video" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-muted mx-auto max-w-4xl px-4 py-8 text-center">Модель не найдена</div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {model.brand} {model.model} — La Moto
        </title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/journal" className="text-accent mb-4 inline-block text-sm hover:underline">
          ← Журнал
        </Link>

        <div className="glass-panel overflow-hidden rounded-xl">
          <img
            src={model.imageUrl}
            alt={`${model.brand} ${model.model}`}
            className="aspect-video w-full object-cover"
          />
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {model.brand} {model.model} ({model.year})
              </h1>
              <Button variant="outline" size="sm" onClick={() => toggleFavorite(model.id)}>
                {favorites.includes(model.id) ? '❤️ В избранном' : '🤍 В избранное'}
              </Button>
            </div>
            <p className="text-muted mb-6">{model.description}</p>

            <h2 className="mb-3 font-semibold">Характеристики</h2>
            <div className="mb-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {Object.entries(model.specs).map(([key, val]) => (
                <div key={key} className="rounded-lg bg-white/5 p-3">
                  <span className="text-muted">{key}</span>
                  <p className="font-medium">{val}</p>
                </div>
              ))}
            </div>

            {related.length > 0 && (
              <>
                <h2 className="mb-4 font-semibold">Объявления о продаже</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
