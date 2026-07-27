export type BikeCategory =
  'sport' | 'chopper' | 'touring' | 'cruiser' | 'enduro' | 'retro' | 'gear' | 'parts';

export type ListingType = 'motorcycle' | 'part' | 'gear';

export type ListingCondition = 'new' | 'used' | 'for-parts';

export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  price: number;
  currency: 'UAH' | 'EUR' | 'USD';
  brand?: string;
  model?: string;
  year?: number;
  condition: ListingCondition;
  category?: BikeCategory;
  city: string;
  imageUrl: string;
  isPremium: boolean;
  source?: 'manual' | 'olx' | 'autoria';
  createdAt: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  createdAt: string;
  replyCount: number;
  likes: number;
  isPinned: boolean;
  preview: string;
}

export interface ForumPost {
  id: string;
  threadId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  mediaUrl?: string;
}

export interface BikerOnMap {
  id: string;
  nickname: string;
  bikeType: string;
  bikeIcon: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  kmToday: number;
  isOnline: boolean;
}

export type EventSource = 'olx' | 'autoria' | 'motofan' | 'facebook' | 'google' | 'manual';

export interface MotoEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  city: string;
  source: EventSource;
  imageUrl: string;
  isPast: boolean;
  gallery?: string[];
}

export type EncyclopediaBikeType = 'sport' | 'chopper' | 'touring' | 'cruiser' | 'enduro' | 'retro';

export interface EncyclopediaModel {
  id: string;
  brand: string;
  model: string;
  type: EncyclopediaBikeType;
  year: number;
  engineVolume: number;
  power: number;
  country: string;
  description: string;
  imageUrl: string;
  specs: Record<string, string>;
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  city: string;
  bikeType: string;
  bikeIcon: string;
  provider: 'google' | 'telegram' | 'facebook';
}

export interface SearchResult {
  id: string;
  type: 'listing' | 'event' | 'encyclopedia' | 'forum';
  title: string;
  subtitle: string;
  url: string;
}

export const BIKE_CATEGORIES: { id: BikeCategory; label: string; emoji: string }[] = [
  { id: 'sport', label: 'Спортбайки', emoji: '🏁' },
  { id: 'chopper', label: 'Чопперы', emoji: '🪶' },
  { id: 'touring', label: 'Туристы', emoji: '🌍' },
  { id: 'cruiser', label: 'Круизеры', emoji: '⚙️' },
  { id: 'enduro', label: 'Эндуро / Кросс', emoji: '🏔️' },
  { id: 'retro', label: 'Ретро', emoji: '🕰️' },
  { id: 'gear', label: 'Экипировка', emoji: '👕' },
  { id: 'parts', label: 'Детали', emoji: '🔩' },
];

export const NAV_ITEMS = [
  { to: '/', label: 'Главная' },
  { to: '/listings', label: 'Объявления' },
  { to: '/forum', label: 'Форум' },
  { to: '/map', label: 'Карта' },
  { to: '/events', label: 'События' },
  { to: '/encyclopedia', label: 'Энциклопедия' },
] as const;

export const REGIONS = ['Киев и область', 'Львов и область', 'Одесса и область', 'Вся Украина'];
