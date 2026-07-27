import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

const InteractiveBikeModel = lazy(() =>
  import('@/features/parts/InteractiveBikeModel').then((m) => ({
    default: m.InteractiveBikeModel,
  })),
);

export function HomePartsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">3D-модель и запчасти</h2>
          <p className="text-muted mt-1 text-sm">
            Выберите деталь на модели или в фильтрах — откроются подходящие объявления
          </p>
        </div>
        <Link to="/models" className="text-accent text-sm hover:underline">
          Открыть 3D модели →
        </Link>
      </div>
      <div className="glass-panel rounded-xl p-6 md:p-10">
        <Suspense fallback={<Skeleton className="mx-auto h-[400px] max-w-4xl rounded-xl" />}>
          <InteractiveBikeModel viewerHeight={400} cameraZoom={1.1} />
        </Suspense>
      </div>
    </section>
  );
}
