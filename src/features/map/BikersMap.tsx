import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMapBikers } from '@/hooks/useMapBikers';
import { REGIONS } from '@/lib/types';
import { bikerMapIcon, getRegionCenter } from '@/features/map/mapUtils';
import 'leaflet/dist/leaflet.css';

interface BikersMapProps {
  height?: number;
  showControls?: boolean;
  defaultRegion?: string;
  onlineOnly?: boolean;
  onMessage?: (nickname: string) => void;
}

export function BikersMap({
  height = 500,
  showControls = true,
  defaultRegion = 'Киев и область',
  onlineOnly = false,
  onMessage,
}: BikersMapProps) {
  const { bikers, loading } = useMapBikers();
  const [onlineMode, setOnlineMode] = useState(true);
  const [region, setRegion] = useState(defaultRegion);

  const filtered = useMemo(() => {
    return bikers.filter((b) => {
      if (region !== 'Вся Украина' && b.region !== region) return false;
      if (onlineOnly || onlineMode) {
        if (!b.isOnline) return false;
      }
      return true;
    });
  }, [bikers, region, onlineMode, onlineOnly]);

  const center = getRegionCenter(region);

  if (loading) {
    return (
      <div style={{ height }}>
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      {showControls && (
        <div className="mb-4 flex flex-wrap justify-end gap-3">
          <Select
            options={REGIONS.map((r) => ({ value: r, label: r }))}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
          {!onlineOnly && (
            <Button
              variant={onlineMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setOnlineMode(!onlineMode)}
            >
              {onlineMode ? 'Онлайн' : 'Офлайн'}
            </Button>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10">
        <MapContainer center={center} zoom={10} style={{ height, width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url={
              onlineMode || onlineOnly
                ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            }
          />
          {filtered.map((biker) => (
            <Marker key={biker.id} position={[biker.lat, biker.lng]} icon={bikerMapIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">
                    {biker.bikeIcon} {biker.nickname}
                  </p>
                  <p>{biker.bikeType}</p>
                  <p>{biker.city}</p>
                  <p>{biker.kmToday} км сегодня</p>
                  {onMessage && (
                    <button
                      className="text-accent mt-2 hover:underline"
                      onClick={() => onMessage(biker.nickname)}
                    >
                      Написать
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="text-muted mt-2 text-sm">
        {filtered.length} байкер(ов) на карте
        {!onlineOnly && !onlineMode && ' (офлайн режим — кэшированные данные)'}
      </p>
    </div>
  );
}
