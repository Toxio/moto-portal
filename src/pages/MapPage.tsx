import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { BikersMap } from '@/features/map/BikersMap';

export function MapPage() {
  const [chatUser, setChatUser] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Карта байкеров — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Карта байкеров</h1>
        <BikersMap showControls onMessage={setChatUser} />
      </div>

      <Modal open={!!chatUser} onClose={() => setChatUser(null)} title={`Чат с ${chatUser}`}>
        <p className="text-muted text-sm">Mock-чат. Сообщения не отправляются.</p>
        <Input placeholder="Введите сообщение..." className="mt-4" />
        <Button className="mt-3" size="sm">
          Отправить
        </Button>
      </Modal>
    </>
  );
}
