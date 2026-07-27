import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { useEvents } from '@/hooks/useEvents';
import { formatDate } from '@/lib/utils';

const TABS = [
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'past', label: 'Прошедшие' },
];

export function EventsPage() {
  const { events, loading } = useEvents();
  const [tab, setTab] = useState('upcoming');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(false);

  const filtered = events.filter((e) => (tab === 'upcoming' ? !e.isPast : e.isPast));

  const handleSubmit = () => {
    setShowAdd(false);
    setToast(true);
  };

  return (
    <>
      <Helmet>
        <title>Мотособытия — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Мотособытия</h1>
          <Button onClick={() => setShowAdd(true)}>+ Добавить событие</Button>
        </div>

        <Tabs tabs={TABS} active={tab} onChange={setTab} />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
            : filtered.map((event) => (
                <Card key={event.id} className="overflow-hidden p-0">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <div className="mb-2 flex gap-2">
                      <Badge variant="source">{event.source}</Badge>
                      {event.isPast && <Badge>Прошедшее</Badge>}
                    </div>
                    <h2 className="mb-1 font-semibold">{event.title}</h2>
                    <p className="text-muted mb-2 text-sm">{formatDate(event.date)}</p>
                    <p className="text-muted text-sm">
                      {event.location}, {event.city}
                    </p>
                    {event.gallery && (
                      <div className="mt-3 flex gap-2">
                        {event.gallery.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="h-12 w-12 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Добавить событие">
        <div className="space-y-3">
          <Input placeholder="Название" />
          <Input placeholder="Дата" type="date" />
          <Input placeholder="Место" />
          <Button className="w-full" onClick={handleSubmit}>
            Отправить на модерацию
          </Button>
        </div>
      </Modal>

      <Toast
        message="Событие отправлено на модерацию"
        visible={toast}
        onHide={() => setToast(false)}
      />
    </>
  );
}
