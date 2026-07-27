import type { BikePart } from '@/lib/types';

export const bikeParts: BikePart[] = [
  { id: 'tank', name: 'Бензобак', description: 'Топливный бак и крышки' },
  { id: 'engine', name: 'Двигатель', description: 'Двигатель и навесное' },
  { id: 'wheels', name: 'Колёса (комплект)', description: 'Комплект колёс, диски и шины' },
  {
    id: 'front-wheel',
    name: 'Переднее колесо',
    description: 'Передний диск, шина, тормозной диск',
  },
  {
    id: 'rear-wheel',
    name: 'Заднее колесо',
    description: 'Задний диск, шина, тормозной диск',
  },
  { id: 'exhaust', name: 'Выхлоп', description: 'Глушитель и коллектор' },
  { id: 'seat', name: 'Сиденье', description: 'Сиденье и обивка' },
];

export function getPartName(partId: string): string {
  return bikeParts.find((p) => p.id === partId)?.name ?? partId;
}
