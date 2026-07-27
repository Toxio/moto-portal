import type { BikePart } from '@/lib/types';

export const bikeParts: BikePart[] = [
  { id: 'tank', name: 'Бензобак', description: 'Топливный бак и крышки' },
  { id: 'engine', name: 'Двигатель', description: 'Двигатель и навесное' },
  { id: 'wheels', name: 'Колёса', description: 'Диски, шины, тормоза' },
  { id: 'exhaust', name: 'Выхлоп', description: 'Глушитель и коллектор' },
  { id: 'seat', name: 'Сиденье', description: 'Сиденье и обивка' },
];

export function getPartName(partId: string): string {
  return bikeParts.find((p) => p.id === partId)?.name ?? partId;
}
