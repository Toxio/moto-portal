import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/Skeleton';
import { HomePage } from '@/pages/HomePage';
import { ListingsPage } from '@/pages/ListingsPage';
import { ListingDetailPage } from '@/pages/ListingDetailPage';
import { ForumPage } from '@/pages/ForumPage';
import { ForumCategoryPage } from '@/pages/ForumCategoryPage';
import { ForumThreadPage } from '@/pages/ForumThreadPage';
import { EventsPage } from '@/pages/EventsPage';
import { EncyclopediaPage } from '@/pages/EncyclopediaPage';
import { EncyclopediaDetailPage } from '@/pages/EncyclopediaDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SearchPage } from '@/pages/SearchPage';

const MapPage = lazy(() => import('@/pages/MapPage').then((m) => ({ default: m.MapPage })));
const ModelsPage = lazy(() =>
  import('@/pages/ModelsPage').then((m) => ({ default: m.ModelsPage })),
);

function PageLoader() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'listings', element: <ListingsPage /> },
      { path: 'listings/:id', element: <ListingDetailPage /> },
      {
        path: 'models',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ModelsPage />
          </Suspense>
        ),
      },
      { path: 'forum', element: <ForumPage /> },
      { path: 'forum/:categoryId', element: <ForumCategoryPage /> },
      { path: 'forum/:categoryId/:threadId', element: <ForumThreadPage /> },
      {
        path: 'map',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MapPage />
          </Suspense>
        ),
      },
      { path: 'events', element: <EventsPage /> },
      { path: 'encyclopedia', element: <EncyclopediaPage /> },
      { path: 'encyclopedia/:id', element: <EncyclopediaDetailPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
]);
