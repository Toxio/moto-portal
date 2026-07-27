import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

const TYPE_LABELS = {
  listing: 'Объявление',
  event: 'Событие',
  encyclopedia: 'Энциклопедия',
  forum: 'Форум',
};

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const results = useGlobalSearch(query);

  return (
    <>
      <Helmet>
        <title>Поиск: {query} — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">Результаты поиска</h1>
        <p className="text-muted mb-6">
          Запрос: «{query}» — найдено {results.length}
        </p>

        <div className="space-y-3">
          {results.map((r) => (
            <Link key={`${r.type}-${r.id}`} to={r.url}>
              <Card className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium">{r.title}</h2>
                  <p className="text-muted text-sm">{r.subtitle}</p>
                </div>
                <span className="text-accent text-xs">{TYPE_LABELS[r.type]}</span>
              </Card>
            </Link>
          ))}
        </div>

        {results.length === 0 && <p className="text-muted text-center">Ничего не найдено</p>}
      </div>
    </>
  );
}
