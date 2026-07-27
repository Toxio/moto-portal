import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useListing } from '@/hooks/useListings';
import { formatDate, formatPrice } from '@/lib/utils';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { listing, loading } = useListing(id!);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-4 aspect-video" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <p className="text-muted">Объявление не найдено</p>
        <Link to="/listings" className="text-accent mt-4 inline-block">
          ← Назад
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{listing.title} — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/listings" className="text-accent mb-4 inline-block text-sm hover:underline">
          ← Все объявления
        </Link>

        <div className="glass-panel overflow-hidden rounded-xl">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="aspect-video w-full object-cover"
          />
          <div className="p-6">
            <div className="mb-2 flex flex-wrap gap-2">
              {listing.isPremium && <Badge variant="premium">Premium</Badge>}
              {listing.source && <Badge variant="source">{listing.source}</Badge>}
              <Badge>{listing.condition}</Badge>
            </div>
            <h1 className="mb-2 text-2xl font-bold">{listing.title}</h1>
            <p className="text-accent mb-4 text-3xl font-bold">
              {formatPrice(listing.price, listing.currency)}
            </p>
            <p className="text-muted mb-6">{listing.description}</p>

            <div className="mb-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              {listing.brand && (
                <div>
                  <span className="text-muted">Марка</span>
                  <p className="font-medium">{listing.brand}</p>
                </div>
              )}
              {listing.model && (
                <div>
                  <span className="text-muted">Модель</span>
                  <p className="font-medium">{listing.model}</p>
                </div>
              )}
              {listing.year && (
                <div>
                  <span className="text-muted">Год</span>
                  <p className="font-medium">{listing.year}</p>
                </div>
              )}
              <div>
                <span className="text-muted">Город</span>
                <p className="font-medium">{listing.city}</p>
              </div>
            </div>

            <p className="text-muted mb-6 text-xs">Опубликовано: {formatDate(listing.createdAt)}</p>
            <Button>Написать продавцу (mock)</Button>
          </div>
        </div>
      </div>
    </>
  );
}
