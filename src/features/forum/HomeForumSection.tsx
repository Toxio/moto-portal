import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ForumThreadCard } from '@/features/forum/ForumThreadCard';
import { useForum } from '@/hooks/useForum';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomeForumSection() {
  const { categories, threads, loading } = useForum();

  const latestThreads = useMemo(() => {
    return [...threads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [threads]);

  const getCategory = (categoryId: string) => categories.find((c) => c.id === categoryId);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Форум — последние темы</h2>
        <Link to="/forum" className="text-accent text-sm hover:underline">
          Весь форум →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
          : latestThreads.map((thread) => (
              <ForumThreadCard
                key={thread.id}
                thread={thread}
                category={getCategory(thread.categoryId)}
              />
            ))}
      </div>
    </section>
  );
}
