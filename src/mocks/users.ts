import type { User } from '@/lib/types';

export const mockUser: User = {
  id: 'u1',
  nickname: 'LaMotoRider',
  email: 'rider@lamoto.ua',
  city: 'Киев',
  bikeType: 'Harley Fat Boy',
  bikeIcon: '🏍️',
  provider: 'google',
};

export const BIKE_ICONS = ['🏍️', '🏁', '🌍', '⚙️', '🏔️', '🕰️'];
