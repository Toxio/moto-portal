import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { ListingCard } from '@/features/listings/ListingCard';
import { useListings } from '@/hooks/useListings';

const TABS = [
  { id: 'motorcycle', label: 'Мотоциклы' },
  { id: 'parts', label: 'Запчасти' },
  { id: 'gear', label: 'Экипировка' },
];

export function ListingsPage() {
  const [searchParams] = useSearchParams();
  const { listings, loading } = useListings();
  const [tab, setTab] = useState(searchParams.get('tab') || 'motorcycle');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab && ['motorcycle', 'parts', 'gear'].includes(urlTab)) {
      setTab(urlTab);
    }
  }, [searchParams]);

  const categoryFilter = searchParams.get('category');

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (l.type !== tab) return false;
      if (categoryFilter && l.category !== categoryFilter) return false;
      if (brand && l.brand?.toLowerCase() !== brand.toLowerCase()) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      return true;
    });
  }, [listings, tab, categoryFilter, brand, maxPrice]);

  const brands = [...new Set(listings.map((l) => l.brand).filter(Boolean))];

  return (
    <>
      <Helmet>
        <title>Объявления — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Объявления</h1>
          <Button onClick={() => setShowAddModal(true)}>+ Добавить объявление</Button>
        </div>

        <Tabs tabs={TABS} active={tab} onChange={setTab} />

        <div className="mt-4 flex flex-wrap gap-3">
          <Select
            options={[
              { value: '', label: 'Все марки' },
              ...brands.map((b) => ({ value: b!, label: b! })),
            ]}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Макс. цена"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
            : filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="text-muted mt-8 text-center">Объявления не найдены</p>
        )}
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Новое объявление">
        <p className="text-muted text-sm">
          Форма добавления объявления (mock). Данные не сохраняются.
        </p>
        <div className="mt-4 space-y-3">
          <Input placeholder="Заголовок" />
          <Input placeholder="Цена" type="number" />
          <Input placeholder="Город" />
          <Button className="w-full" onClick={() => setShowAddModal(false)}>
            Опубликовать (mock)
          </Button>
        </div>
      </Modal>
    </>
  );
}
