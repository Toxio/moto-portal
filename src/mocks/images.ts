import sportCategoryPhoto from '@/assets/categories/sport.jpg';

export const unsplash = (id: string, width = 800, height?: number) =>
  `https://images.unsplash.com/photo-${id}?w=${width}${height ? `&h=${height}` : ''}&q=80&auto=format&fit=crop`;

/** Category thumbnail photos — Unsplash IDs, asset imports, or full image URLs. */
export const CATEGORY_PHOTOS = {
  /** motoamerica.com blocks hotlink (403) — local copy of the same press photo */
  sport: sportCategoryPhoto,
  chopper:
    'https://japanlife-moto.ru/upload/resize_cache/webp/iblock/234/qnaqmqp8grerh62zg2b70nu0y4129tzd.webp',
  touring:
    'https://static.wixstatic.com/media/720c00_8cb6740020244a23b94f5c9505f0b3b5~mv2.jpg/v1/fill/w_1103,h_675,al_c,q_85,enc_avif,quality_auto/720c00_8cb6740020244a23b94f5c9505f0b3b5~mv2.jpg',
  cruiser: '1558981000-f294a6ed32b2',
  enduro: 'https://hyperlook.ru/upload/iblock/5db/lrxbhf9y6vc50olhl9memi4npzi31bvp.jpg',
  retro: 'https://carakoom.com/data/wall/787/640b66f9_medium.jpg',
  gear: '1771574207619-ebf770550c16',
  parts: '1771402629441-95e637743f93',
} as const;

export type CategoryPhotoKey = keyof typeof CATEGORY_PHOTOS;

export const mockCategoryImage = (category: CategoryPhotoKey, width = 320) => {
  const photo = CATEGORY_PHOTOS[category];
  if (photo.startsWith('http') || photo.startsWith('/')) return photo;
  return unsplash(photo, width, 240);
};

/** Verified Unsplash photo IDs (404-safe as of 2026). */
export const MOCK_PHOTOS = {
  cruiserHarley: '1558981000-f294a6ed32b2',
  sportYamahaR1: '1571646036117-8015cc02547c',
  adventureTouring: '1633920456892-b63e78d6114c',
  retroBmw: '1611112443065-18ba328bf289',
  chopperCruiser: '1515777315835-281b94c9589f',
  touringRoad: '1571068316344-75bc76f77890',
  brakeDisc: '1762012507780-060fe0bcc783',
  motorcycleSeat: '1698721565802-93304e318d77',
  frontWheel: '1770400770372-fc8eed990bd8',
  rearWheel: '1749339368059-271e1e59d1d4',
  exhaust: '1769537754889-8d731b83547f',
  handlebar: '1770923898118-b4f25f7e18eb',
  helmet: '1771574207619-ebf770550c16',
  leatherJacket: '1551028719-00167b16eac5',
  heroMotorcycle: '1558981852-426c6c22a060',
  cruiserSilver: '1610697180268-8a279a15ff7c',
  workshop: '1558618666-fcd25c85cd64',
} as const;

export const mockImage = (key: keyof typeof MOCK_PHOTOS, width?: number) =>
  unsplash(MOCK_PHOTOS[key], width);
