import L from 'leaflet';

export const bikerMapIcon = L.divIcon({
  html: '<span style="font-size:24px">🏍️</span>',
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export function getRegionCenter(region: string): [number, number] {
  if (region === 'Львов и область') return [49.8397, 24.0297];
  if (region === 'Одесса и область') return [46.4825, 30.7233];
  return [50.4501, 30.5234];
}
