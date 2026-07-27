import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

const InteractiveBikeModel = lazy(() =>
  import('@/features/parts/InteractiveBikeModel').then((m) => ({
    default: m.InteractiveBikeModel,
  })),
);

export function ModelsPage() {
  return (
    <>
      <Helmet>
        <title>3D модели — La Moto</title>
        <meta name="description" content="Интерактивные 3D-модели мотоциклов и выбор запчастей" />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">3D модели</h1>
            <p className="text-muted mt-2 max-w-2xl text-sm">
              Вращайте модель, рассматривайте мотоцикл со всех сторон и выбирайте деталь для поиска
              запчастей в объявлениях.
            </p>
          </div>
          <Link to="/listings?tab=parts" className="text-accent text-sm hover:underline">
            Все запчасти →
          </Link>
        </div>

        <div className="glass-panel rounded-xl p-4 md:p-8">
          <Suspense fallback={<Skeleton className="h-[min(70vh,640px)] w-full rounded-xl" />}>
            <InteractiveBikeModel viewerHeight={640} cameraZoom={1.1} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
