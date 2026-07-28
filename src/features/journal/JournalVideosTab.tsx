import type { JournalVideo } from '@/lib/types';
import { mockJournalVideos } from '@/mocks/journal';

function formatViews(views: number) {
  if (views >= 1_000_000) {
    const millions = views / 1_000_000;
    return `${millions >= 10 ? Math.round(millions) : millions.toFixed(1).replace('.0', '')} млн`;
  }
  if (views >= 1000) return `${Math.round(views / 1000)} тыс.`;
  return String(views);
}

function VideoCard({ video }: { video: JournalVideo }) {
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <article className="glass-panel overflow-hidden rounded-xl">
      <div className="aspect-video w-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="p-5 sm:p-6">
        {video.featured && (
          <span className="bg-accent/15 text-accent mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold">
            Популярное · обучение
          </span>
        )}
        <h2 className="text-lg font-semibold sm:text-xl">{video.title}</h2>
        <p className="text-muted mt-2 text-sm">
          {video.channel} · {formatViews(video.views)} просмотров · украинский
        </p>
        <p className="text-muted mt-3 text-sm leading-relaxed">{video.description}</p>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent mt-4 inline-block text-sm font-medium hover:underline"
        >
          Смотреть на YouTube →
        </a>
      </div>
    </article>
  );
}

export function JournalVideosTab() {
  const featured = mockJournalVideos.find((v) => v.featured) ?? mockJournalVideos[0];

  if (!featured) {
    return (
      <div className="glass-panel rounded-xl px-6 py-16 text-center">
        <p className="mb-2 text-lg font-semibold">Видео скоро</p>
        <p className="text-muted text-sm">Обзоры, тест-драйвы и полезные ролики для байкеров.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <VideoCard video={featured} />
    </div>
  );
}
