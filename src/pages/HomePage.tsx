import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BIKE_CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { ListingCard } from '@/features/listings/ListingCard';
import { useListings } from '@/hooks/useListings';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomePage() {
  const { listings, loading } = useListings();
  const featured = listings.filter((l) => l.isPremium).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>La Moto — Мотобарахолка</title>
        <meta name="description" content="Мотобарахолка для байкеров Украины и Европы" />
      </Helmet>

      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1558981403-c5f9899a443c?w=1920&q=80)',
          }}
        />
        <div className="from-primary/80 via-primary/60 to-primary absolute inset-0 bg-gradient-to-b" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-6xl">
            La <span className="text-accent">Moto</span>
          </h1>
          <p className="mb-8 text-lg text-white/80 md:text-xl">
            Мотобарахолка, карта байкеров, форум и энциклопедия
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/listings">
              <Button size="lg">Смотреть объявления</Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="lg">
                Карта байкеров
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Категории</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {BIKE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={
                cat.id === 'gear' || cat.id === 'parts'
                  ? `/listings?tab=${cat.id === 'gear' ? 'gear' : 'parts'}`
                  : `/listings?category=${cat.id}`
              }
              className="gradient-border hover-glow flex flex-col items-center gap-2 rounded-xl p-4 text-center transition"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Premium объявления</h2>
          <Link to="/listings" className="text-accent text-sm hover:underline">
            Все объявления →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
            : featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>
    </>
  );
}
