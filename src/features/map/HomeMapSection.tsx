import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

const BikersMap = lazy(() =>
  import('@/features/map/BikersMap').then((m) => ({ default: m.BikersMap })),
);

export function HomeMapSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Байкеры онлайн</h2>
          <p className="text-muted mt-1 text-sm">Киев и область — кто сейчас на дороге</p>
        </div>
        <Link to="/map" className="text-accent text-sm hover:underline">
          Открыть полную карту →
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-[360px] w-full rounded-xl" />}>
        <BikersMap height={360} showControls={false} onlineOnly defaultRegion="Киев и область" />
      </Suspense>
    </section>
  );
}
