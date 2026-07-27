import type { BikePart } from '@/lib/types';

export const bikeParts: BikePart[] = [
  { id: 'seat', name: 'Сиденье', description: 'Сиденье и обивка' },
  {
    id: 'brakes',
    name: 'Тормоза',
    description: 'Диски, колодки, суппорты, ABS',
  },
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
  {
    id: 'handlebar',
    name: 'Руль',
    description: 'Руль, грипсы, переключатели',
  },
];

export function getPartName(partId: string): string {
  return bikeParts.find((p) => p.id === partId)?.name ?? partId;
}
