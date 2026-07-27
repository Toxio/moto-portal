import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMapBikers } from '@/hooks/useMapBikers';
import { REGIONS } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

const icon = L.divIcon({
  html: '<span style="font-size:24px">🏍️</span>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export function MapPage() {
  const { bikers, loading } = useMapBikers();
  const [onlineMode, setOnlineMode] = useState(true);
  const [region, setRegion] = useState('Киев и область');
  const [chatUser, setChatUser] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return bikers.filter((b) => {
      if (region !== 'Вся Украина' && b.region !== region) return false;
      if (onlineMode && !b.isOnline) return false;
      return true;
    });
  }, [bikers, region, onlineMode]);

  const center: [number, number] =
    region === 'Львов и область'
      ? [49.8397, 24.0297]
      : region === 'Одесса и область'
        ? [46.4825, 30.7233]
        : [50.4501, 30.5234];

  return (
    <>
      <Helmet>
        <title>Карта байкеров — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Карта байкеров</h1>
          <div className="flex flex-wrap gap-3">
            <Select
              options={REGIONS.map((r) => ({ value: r, label: r }))}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <Button
              variant={onlineMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setOnlineMode(!onlineMode)}
            >
              {onlineMode ? 'Онлайн' : 'Офлайн'}
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <MapContainer center={center} zoom={10} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url={
                  onlineMode
                    ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                }
              />
              {filtered.map((biker) => (
                <Marker key={biker.id} position={[biker.lat, biker.lng]} icon={icon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">
                        {biker.bikeIcon} {biker.nickname}
                      </p>
                      <p>{biker.bikeType}</p>
                      <p>{biker.city}</p>
                      <p>{biker.kmToday} км сегодня</p>
                      <button
                        className="text-accent mt-2 hover:underline"
                        onClick={() => setChatUser(biker.nickname)}
                      >
                        Написать
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        <p className="text-muted mt-2 text-sm">
          {filtered.length} байкер(ов) на карте
          {!onlineMode && ' (офлайн режим — кэшированные данные)'}
        </p>
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
