import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BIKE_CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { ListingCard } from '@/features/listings/ListingCard';
import { HomeMapSection } from '@/features/map/HomeMapSection';
import { HomePartsPreview } from '@/features/parts/HomePartsPreview';
import { HomeForumSection } from '@/features/forum/HomeForumSection';
import { HomeEventsSection } from '@/features/events/HomeEventsSection';
import { useListings } from '@/hooks/useListings';
import { mockImage } from '@/mocks/images';
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

      <section className="relative isolate overflow-hidden pb-8 md:max-h-[980px] md:min-h-[max(640px,100svh)] md:pb-0">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{
              backgroundImage: `url(${mockImage('heroMotorcycle', 1920)})`,
            }}
            aria-hidden
          />
          <img
            src={mockImage('heroMotorcycle', 2400)}
            alt=""
            aria-hidden
            className="absolute inset-0 hidden h-full w-full origin-[50%_56%] scale-100 object-cover object-[50%_56%] md:block"
          />
        </div>
        <div className="absolute inset-0 bg-black/55 md:bg-black/20" />
        <div className="from-primary/70 via-primary/35 absolute inset-0 bg-gradient-to-b to-transparent md:hidden" />
        <div className="from-primary via-primary/75 absolute inset-0 hidden bg-gradient-to-t from-15% via-45% to-transparent md:block" />
        <div className="from-primary absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t to-transparent md:block" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-[5.5rem] md:absolute md:inset-x-0 md:top-[32%] md:pt-0 lg:top-[36%]">
          <div className="animate-fade-in mx-auto max-w-2xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="bg-accent h-px w-6 sm:w-10" aria-hidden />
              <p className="text-accent max-w-xs text-sm font-medium tracking-wide sm:max-w-none md:text-base">
                Больше чем просто мотобарахолка
              </p>
              <span className="bg-accent h-px w-6 sm:w-10" aria-hidden />
            </div>

            <h1 className="mb-4 text-[clamp(2.75rem,12vw,7rem)] leading-[0.88] font-bold tracking-[-0.03em] uppercase md:mb-5">
              <span className="text-white">La </span>
              <span className="text-accent drop-shadow-[0_0_42px_rgba(220,38,38,0.5)]">Moto</span>
            </h1>

            <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed font-light text-white/75 md:mb-9 md:text-lg">
              Объявления, карта байкеров, форум и энциклопедия — всё для тех, кто живёт мото
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link to="/listings">
                <Button size="lg" className="rounded-full px-7 font-semibold">
                  Смотреть объявления
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" size="lg" className="rounded-full px-7 font-semibold">
                  Карта байкеров
                </Button>
              </Link>
            </div>
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

      <HomePartsPreview />

      <HomeMapSection />

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

      <HomeEventsSection />

      <HomeForumSection />
    </>
  );
}
