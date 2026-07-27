import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { ListingCard } from '@/features/listings/ListingCard';
import { useListings } from '@/hooks/useListings';
import { getPartName } from '@/mocks/parts';

const InteractiveBikeModel = lazy(() =>
  import('@/features/parts/InteractiveBikeModel').then((m) => ({
    default: m.InteractiveBikeModel,
  })),
);

import type { ListingType } from '@/lib/types';

const TABS = [
  { id: 'motorcycle', label: 'Мотоциклы' },
  { id: 'parts', label: 'Запчасти' },
  { id: 'gear', label: 'Экипировка' },
];

function tabToListingType(tab: string): ListingType {
  return tab === 'parts' ? 'part' : (tab as ListingType);
}

export function ListingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { listings, loading } = useListings();
  const [tab, setTab] = useState(searchParams.get('tab') || 'motorcycle');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const part = searchParams.get('part');
    if (urlTab && ['motorcycle', 'parts', 'gear'].includes(urlTab)) {
      setTab(urlTab);
    } else if (part) {
      setTab('parts');
    }
  }, [searchParams]);

  const categoryFilter = searchParams.get('category');
  const partFilter = searchParams.get('part');

  const filtered = useMemo(() => {
    const listingType = tabToListingType(tab);

    return listings.filter((l) => {
      if (l.type !== listingType) return false;
      if (partFilter && l.partId !== partFilter) return false;
      if (categoryFilter && l.category !== categoryFilter) return false;
      if (brand && l.brand?.toLowerCase() !== brand.toLowerCase()) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      return true;
    });
  }, [listings, tab, partFilter, categoryFilter, brand, maxPrice]);

  const handlePartSelect = (partId: string) => {
    navigate(`/listings?tab=parts&part=${partId}`);
  };

  const clearPartFilter = () => {
    navigate('/listings?tab=parts');
  };

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

        {tab === 'parts' && (
          <div className="glass-panel mt-6 rounded-xl p-4 md:p-6">
            <h2 className="mb-4 text-lg font-semibold">Поиск по 3D-схеме</h2>
            <Suspense fallback={<Skeleton className="mx-auto h-56 max-w-2xl rounded-xl" />}>
              <InteractiveBikeModel
                activePart={partFilter}
                onPartSelect={handlePartSelect}
                linkToListings={false}
                viewerHeight={360}
                cameraZoom={1.1}
                className="mx-auto max-w-2xl"
              />
            </Suspense>
            {partFilter && (
              <div className="mt-4 flex justify-center">
                <Button variant="ghost" size="sm" onClick={clearPartFilter}>
                  Сбросить фильтр: {getPartName(partFilter)}
                </Button>
              </div>
            )}
          </div>
        )}

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
