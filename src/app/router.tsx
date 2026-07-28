import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/Skeleton';
import { HomePage } from '@/pages/HomePage';
import { ListingsPage } from '@/pages/ListingsPage';
import { ListingDetailPage } from '@/pages/ListingDetailPage';
import { ForumPage } from '@/pages/ForumPage';
import { ForumCategoryPage } from '@/pages/ForumCategoryPage';
import { ForumThreadPage } from '@/pages/ForumThreadPage';
import { EventsPage } from '@/pages/EventsPage';
import { JournalPage } from '@/pages/JournalPage';
import { JournalModelDetailPage } from '@/pages/JournalModelDetailPage';
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

function EncyclopediaRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/journal/${id}` : '/journal'} replace />;
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
      { path: 'journal', element: <JournalPage /> },
      { path: 'journal/:id', element: <JournalModelDetailPage /> },
      { path: 'encyclopedia', element: <Navigate to="/journal" replace /> },
      { path: 'encyclopedia/:id', element: <EncyclopediaRedirect /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
]);
