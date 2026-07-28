import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs } from '@/components/ui/Tabs';
import { JournalModelsTab } from '@/features/journal/JournalModelsTab';
import { JournalVideosTab } from '@/features/journal/JournalVideosTab';

const JOURNAL_TABS = [
  { id: 'models', label: 'Модели' },
  { id: 'videos', label: 'Видео' },
  { id: 'articles', label: 'Статьи' },
] as const;

type JournalTabId = (typeof JOURNAL_TABS)[number]['id'];

function JournalPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-panel rounded-xl px-6 py-16 text-center">
      <p className="mb-2 text-lg font-semibold">{title}</p>
      <p className="text-muted text-sm">{description}</p>
    </div>
  );
}

export function JournalPage() {
  const [tab, setTab] = useState<JournalTabId>('models');

  return (
    <>
      <Helmet>
        <title>Мото журнал — La Moto</title>
        <meta
          name="description"
          content="Обзоры моделей, статьи и видео для байкеров — La Moto Journal"
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Журнал</h1>
          <p className="text-muted mt-2">Обзоры моделей, статьи и видео для байкеров</p>
        </div>

        <Tabs tabs={[...JOURNAL_TABS]} active={tab} onChange={(id) => setTab(id as JournalTabId)} />

        <div className="mt-6">
          {tab === 'models' && <JournalModelsTab />}
          {tab === 'videos' && <JournalVideosTab />}
          {tab === 'articles' && (
            <JournalPlaceholder
              title="Статьи скоро"
              description="Гайды, сравнения и обзоры — готовим первые материалы."
            />
          )}
        </div>
      </div>
    </>
  );
}
