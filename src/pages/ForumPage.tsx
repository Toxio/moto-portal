import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useForum } from '@/hooks/useForum';

export function ForumPage() {
  const { categories, loading } = useForum();

  return (
    <>
      <Helmet>
        <title>Форум — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Форум</h1>
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)
            : categories.map((cat) => (
                <Link key={cat.id} to={`/forum/${cat.id}`}>
                  <Card className="flex items-center gap-4">
                    <span className="text-3xl">{cat.icon}</span>
                    <div className="flex-1">
                      <h2 className="font-semibold">{cat.name}</h2>
                      <p className="text-muted text-sm">{cat.description}</p>
                    </div>
                    <span className="text-muted text-sm">{cat.threadCount} тем</span>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </>
  );
}
