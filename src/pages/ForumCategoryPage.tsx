import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useForum } from '@/hooks/useForum';
import { formatDate } from '@/lib/utils';

export function ForumCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories, threads, addThread } = useForum();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');

  const category = categories.find((c) => c.id === categoryId);
  const categoryThreads = threads
    .filter((t) => t.categoryId === categoryId)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const handleCreate = () => {
    if (!title.trim() || !categoryId) return;
    addThread({
      id: `t-${Date.now()}`,
      categoryId,
      title: title.trim(),
      author: 'Guest',
      createdAt: new Date().toISOString(),
      replyCount: 0,
      likes: 0,
      isPinned: false,
      preview: '',
    });
    setTitle('');
    setShowNew(false);
  };

  return (
    <>
      <Helmet>
        <title>{category?.name ?? 'Форум'} — La Moto</title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/forum" className="text-accent mb-4 inline-block text-sm hover:underline">
          ← Форум
        </Link>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{category?.name}</h1>
          <Button size="sm" onClick={() => setShowNew(true)}>
            + Новая тема
          </Button>
        </div>

        <div className="space-y-3">
          {categoryThreads.map((thread) => (
            <Link key={thread.id} to={`/forum/${categoryId}/${thread.id}`}>
              <Card className="flex items-center gap-3">
                {thread.isPinned && <Badge variant="premium">📌</Badge>}
                <div className="flex-1">
                  <h2 className="font-medium">{thread.title}</h2>
                  <p className="text-muted text-xs">
                    {thread.author} · {formatDate(thread.createdAt)} · {thread.replyCount} ответов
                  </p>
                </div>
                <span className="text-muted text-sm">❤️ {thread.likes}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Новая тема">
        <Input
          placeholder="Заголовок темы"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button className="mt-4 w-full" onClick={handleCreate}>
          Создать
        </Button>
      </Modal>
    </>
  );
}
