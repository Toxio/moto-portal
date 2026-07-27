import type { ForumCategory, ForumPost, ForumThread } from '@/lib/types';

export const mockForumCategories: ForumCategory[] = [
  {
    id: 'repair',
    name: 'Ремонт и обслуживание',
    description: 'Диагностика, ТО, запчасти и инструменты',
    icon: '🔧',
    threadCount: 142,
  },
  {
    id: 'tuning',
    name: 'Тюнинг',
    description: 'Кастом, выхлопы, подвеска, электроника',
    icon: '⚡',
    threadCount: 89,
  },
  {
    id: 'gear',
    name: 'Экипировка',
    description: 'Шлемы, куртки, перчатки, обувь',
    icon: '👕',
    threadCount: 56,
  },
  {
    id: 'travel',
    name: 'Путешествия',
    description: 'Маршруты, отзывы, советы для дальних поездок',
    icon: '🌍',
    threadCount: 73,
  },
  {
    id: 'clubs',
    name: 'Клубы и сообщества',
    description: 'Мотоклубы, слёты, знакомства',
    icon: '🤝',
    threadCount: 45,
  },
];

export const mockForumThreads: ForumThread[] = [
  {
    id: 't1',
    categoryId: 'repair',
    title: 'Замена масла на Harley — какое лучше?',
    author: 'RoadKing',
    createdAt: '2026-02-10',
    replyCount: 24,
    likes: 18,
    isPinned: true,
    preview: 'Планирую первое ТО после зимы...',
  },
  {
    id: 't2',
    categoryId: 'repair',
    title: 'Скрип передней подвески на R1',
    author: 'SpeedDemon',
    createdAt: '2026-02-09',
    replyCount: 12,
    likes: 7,
    isPinned: false,
    preview: 'После 5000 км начал скрипеть...',
  },
  {
    id: 't3',
    categoryId: 'tuning',
    title: 'Кастом Fat Boy — фотоотчёт',
    author: 'CustomRider',
    createdAt: '2026-02-08',
    replyCount: 45,
    likes: 92,
    isPinned: true,
    preview: '6 месяцев работы над проектом...',
  },
  {
    id: 't4',
    categoryId: 'travel',
    title: 'Маршрут Киев — Карпаты за выходные',
    author: 'TourMaster',
    createdAt: '2026-02-07',
    replyCount: 31,
    likes: 54,
    isPinned: false,
    preview: 'Подробный маршрут с остановками...',
  },
];

export const mockForumPosts: ForumPost[] = [
  {
    id: 'p1',
    threadId: 't1',
    author: 'RoadKing',
    content:
      'Планирую первое ТО после зимы. Кто какое масло использует на Twin Cam? Слышал про Mobil 1 и Spectro.',
    createdAt: '2026-02-10T10:00:00',
    likes: 5,
  },
  {
    id: 'p2',
    threadId: 't1',
    author: 'HarleyPro',
    content:
      'Spectro Heavy Duty — классика для Harley. Меняю каждые 8000 км, двигатель работает как часы.',
    createdAt: '2026-02-10T11:30:00',
    likes: 12,
  },
  {
    id: 'p3',
    threadId: 't1',
    author: 'OilExpert',
    content: 'Mobil 1 V-Twin 20W-50 тоже отличный вариант. Главное — не экономить на фильтре.',
    createdAt: '2026-02-10T14:00:00',
    likes: 8,
  },
];
